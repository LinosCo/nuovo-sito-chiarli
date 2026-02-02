import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Carica variabili d'ambiente
dotenv.config();

import { contentService } from './services/content.service.js';
import { claudeService } from './services/claude.service.js';
import { gitService } from './services/git.service.js';
import { uploadService } from './services/upload.service.js';
import { btAuth } from './middleware/btAuth.js';
import { integrationController } from './controllers/integration.controller.js';
import {
  requireAuth,
  optionalAuth,
  createSession,
  destroySession,
  getSession
} from './middleware/sessionAuth.js';
import { validateBTToken } from './services/btAuth.service.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3002', // Dashboard CMS locale
    'https://chiarlicmsdashboard.vercel.app', // Dashboard CMS Vercel
    'https://cletochiarli.cms.voler.ai', // Sito preview nel CMS
    /\.vercel\.app$/, // Tutti i deployment preview Vercel
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Cookie parser per gestione sessioni
app.use(cookieParser());

// IMPORTANTE: Route PDF DEVE venire PRIMA di express.json() per evitare conflitti
/**
 * POST /api/upload/pdf
 * Carica e analizza un PDF (scheda tecnica vino)
 * Usa un handler personalizzato per evitare conflitti con Multer
 * RICHIEDE AUTENTICAZIONE (verificata manualmente perché viene prima di cookieParser)
 */
app.post('/api/upload/pdf', express.raw({ type: 'application/pdf', limit: '10mb' }), async (req, res) => {
  try {
    // Verifica autenticazione manualmente (il middleware requireAuth non può essere usato qui)
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'NO_SESSION'
      });
    }
    const token = authHeader.substring(7);
    const session = getSession(token);
    if (!session) {
      return res.status(401).json({
        error: 'Session expired',
        code: 'SESSION_EXPIRED'
      });
    }

    console.log(`[Upload/PDF] User ${session.userEmail} uploading PDF`);
    console.log('[Upload/PDF] Content-Type:', req.headers['content-type']);
    console.log('[Upload/PDF] Body length:', req.body?.length);

    if (!req.body || req.body.length === 0) {
      return res.status(400).json({ error: 'Nessun file PDF caricato' });
    }

    console.log('[Upload/PDF] Invio a Claude per analisi...');

    // Usa Claude per analizzare il PDF
    const result = await claudeService.parsePdfWineSheet(req.body);

    if (!result.success) {
      console.error('[Upload/PDF] Errore parsing:', result.error);
      return res.status(400).json({ error: result.error });
    }

    console.log('[Upload/PDF] Analisi completata con successo');

    // L'immagine verrà caricata separatamente dall'utente tramite "Carica Immagine"
    // e poi assegnata tramite chat con "usa questa immagine per il vino X"
    result.data.image = null;

    res.json({
      success: true,
      extracted: result.data,
      message: 'PDF analizzato con successo',
    });
  } catch (error: any) {
    console.error('[Upload/PDF] Errore:', error.message, error.stack);
    res.status(500).json({ error: `Errore analisi PDF: ${error.message}` });
  }
});

app.use(express.json());

// Multer per upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per immagini
});

// Multer per PDF
const pdfUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per PDF
});

// ============================================
// ROUTES - HOME
// ============================================

/**
 * GET /
 * Home page - API status
 */
app.get('/', (req, res) => {
  res.json({
    name: 'Chiarli CMS API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      chat: 'POST /api/chat',
      content: 'GET /api/content/:type',
      upload: 'POST /api/upload/:category',
      integration: {
        status: 'GET /api/integration/status',
        suggestions: 'POST /api/integration/suggestions',
        content: 'GET /api/integration/content'
      }
    },
    dashboard: process.env.DASHBOARD_URL || 'http://localhost:3002'
  });
});

// ============================================
// ROUTES - AUTHENTICATION
// ============================================

/**
 * POST /api/auth/validate
 * Valida token JWT da Business Tuner e crea sessione locale
 */
app.post('/api/auth/validate', async (req, res) => {
  try {
    const { bt_token, bt_connection } = req.body;

    if (!bt_token) {
      return res.status(400).json({
        error: 'Missing token',
        code: 'MISSING_TOKEN'
      });
    }

    // Usa connectionId da request o da env var come fallback
    const connectionId = bt_connection || process.env.BUSINESS_TUNER_CONNECTION_ID;

    if (!connectionId) {
      return res.status(400).json({
        error: 'Missing connection ID',
        code: 'MISSING_CONNECTION_ID'
      });
    }

    // Valida con Business Tuner
    const validation = await validateBTToken(bt_token, connectionId);

    if (!validation.valid) {
      return res.status(401).json({
        error: validation.error || 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }

    // Crea sessione locale
    const sessionToken = createSession({
      userId: validation.user!.id,
      userEmail: validation.user!.email,
      projectId: validation.project!.id,
      organizationId: validation.organization!.id,
      permissions: validation.user!.permissions
    });

    // Set cookie sicuro
    res.cookie('cms_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 ore
    });

    console.log(`[Auth] User ${validation.user!.email} authenticated successfully`);

    res.json({
      success: true,
      user: {
        email: validation.user!.email,
        permissions: validation.user!.permissions
      },
      sessionToken // Anche come risposta per client-side storage
    });

  } catch (error: any) {
    console.error('[Auth] Validation error:', error.message);
    res.status(500).json({
      error: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
});

/**
 * GET /api/auth/session
 * Verifica sessione corrente
 */
app.get('/api/auth/session', optionalAuth, (req, res) => {
  const session = (req as any).session;

  if (!session) {
    return res.json({
      authenticated: false
    });
  }

  res.json({
    authenticated: true,
    user: {
      email: session.userEmail,
      permissions: session.permissions
    }
  });
});

/**
 * POST /api/auth/logout
 * Termina sessione
 */
app.post('/api/auth/logout', optionalAuth, (req, res) => {
  const token = (req as any).sessionToken;

  if (token) {
    destroySession(token);
  }

  res.clearCookie('cms_session');
  res.json({ success: true });
});

// ============================================
// ROUTES - CHAT (PROTECTED)
// ============================================

/**
 * POST /api/chat
 * Endpoint principale per la chat con l'assistente
 * RICHIEDE AUTENTICAZIONE
 */
app.post('/api/chat', requireAuth, async (req, res) => {
  try {
    const { message, image } = req.body;
    const session = (req as any).session;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Messaggio richiesto' });
    }

    // Log per audit
    console.log(`[Chat] User ${session.userEmail}: ${message.substring(0, 50)}...`);

    // Passa sia il messaggio che l'eventuale immagine (base64)
    const response = await claudeService.processMessage(message, image || null);

    res.json(response);
  } catch (error: any) {
    console.error('[Chat] Errore:', error.message);
    res.status(500).json({ error: 'Errore elaborazione messaggio' });
  }
});

/**
 * POST /api/chat/confirm
 * Conferma ed esegue un'azione
 * RICHIEDE AUTENTICAZIONE
 */
app.post('/api/chat/confirm', requireAuth, async (req, res) => {
  try {
    const { action } = req.body;
    const session = (req as any).session;

    if (!action) {
      return res.status(400).json({ error: 'Azione richiesta' });
    }

    // Log per audit
    console.log(`[Chat/Confirm] User ${session.userEmail} executing: ${action.type}`);

    // Esegui l'azione
    const result = await claudeService.executeAction(action);

    // Se successo, crea commit automatico con info utente
    if (result.success && process.env.GIT_AUTO_COMMIT === 'true') {
      await gitService.autoCommit(
        `${action.type} ${action.contentType}${action.itemId ? ` #${action.itemId}` : ''} [by ${session.userEmail}]`
      );
    }

    res.json(result);
  } catch (error: any) {
    console.error('[Chat/Confirm] Errore:', error.message);
    res.status(500).json({ error: 'Errore esecuzione azione' });
  }
});

/**
 * POST /api/chat/reset
 * Resetta la conversazione
 * RICHIEDE AUTENTICAZIONE
 */
app.post('/api/chat/reset', requireAuth, (req, res) => {
  claudeService.resetConversation();
  res.json({ success: true, message: 'Conversazione resettata' });
});

// ============================================
// ROUTES - CONTENT
// ============================================

/**
 * GET /api/content/:type
 * Legge un tipo di contenuto
 */
app.get('/api/content/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = ['wines', 'tenute', 'experiences', 'news', 'settings'];

    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Tipo contenuto non valido' });
    }

    const data = await contentService.read(type as any);
    res.json(data);
  } catch (error: any) {
    console.error('[Content] Errore lettura:', error.message);
    res.status(500).json({ error: 'Errore lettura contenuto' });
  }
});

/**
 * GET /api/content/pages/:page
 * Legge contenuto di una pagina
 */
app.get('/api/content/pages/:page', async (req, res) => {
  try {
    const { page } = req.params;
    const validPages = ['home', 'storia'];

    if (!validPages.includes(page)) {
      return res.status(400).json({ error: 'Pagina non valida' });
    }

    const data = await contentService.read(`pages/${page}` as any);
    res.json(data);
  } catch (error: any) {
    console.error('[Content/Pages] Errore lettura:', error.message);
    res.status(500).json({ error: 'Errore lettura pagina' });
  }
});

/**
 * PUT /api/content/pages/:page
 * Aggiorna una pagina intera o campi specifici
 * RICHIEDE AUTENTICAZIONE
 */
app.put('/api/content/pages/:page', requireAuth, async (req, res) => {
  try {
    const { page } = req.params;
    const updates = req.body;
    const session = (req as any).session;
    const validPages = ['home', 'storia'];

    if (!validPages.includes(page)) {
      return res.status(400).json({ error: 'Pagina non valida' });
    }

    console.log(`[Content/Pages] User ${session.userEmail} updating pages/${page}`);

    // Leggi la pagina corrente
    const currentData = await contentService.read(`pages/${page}` as any);

    // Merge degli aggiornamenti
    const mergedData = { ...currentData, ...updates };

    // Se ci sono aggiornamenti nested (es. hero.subtitle), gestiscili
    if (updates.fieldPath && updates.value !== undefined) {
      const parts = updates.fieldPath.split('.');
      let current: any = mergedData;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = updates.value;
      delete mergedData.fieldPath;
      delete mergedData.value;
    }

    // Scrivi i dati aggiornati
    const result = await contentService.write(`pages/${page}` as any, mergedData, session.userEmail);

    // Commit automatico
    if (process.env.GIT_AUTO_COMMIT === 'true') {
      await gitService.autoCommit(`Aggiornata pagina ${page} [by ${session.userEmail}]`);
    }

    res.json(result);
  } catch (error: any) {
    console.error('[Content/Pages] Errore aggiornamento:', error.message);
    res.status(500).json({ error: 'Errore aggiornamento pagina' });
  }
});

/**
 * PUT /api/content/:type/:id
 * Aggiorna un item specifico
 * RICHIEDE AUTENTICAZIONE
 */
app.put('/api/content/:type/:id', requireAuth, async (req, res) => {
  try {
    const { type, id } = req.params;
    const updates = req.body;
    const session = (req as any).session;

    console.log(`[Content] User ${session.userEmail} updating ${type} #${id}`);

    const result = await contentService.updateItem(type as any, parseInt(id as string), updates, 'api');

    if (!result) {
      return res.status(404).json({ error: 'Item non trovato' });
    }

    // Commit automatico
    if (process.env.GIT_AUTO_COMMIT === 'true') {
      await gitService.autoCommit(`Aggiornato ${type} #${id} [by ${session.userEmail}]`);
    }

    res.json(result);
  } catch (error: any) {
    console.error('[Content] Errore aggiornamento:', error.message);
    res.status(500).json({ error: 'Errore aggiornamento' });
  }
});

/**
 * POST /api/content/:type
 * Crea un nuovo item
 * RICHIEDE AUTENTICAZIONE
 */
app.post('/api/content/:type', requireAuth, async (req, res) => {
  try {
    const { type } = req.params;
    const item = req.body;
    const session = (req as any).session;

    console.log(`[Content] User ${session.userEmail} creating ${type}`);

    const result = await contentService.addItem(type as any, item, 'api');

    // Commit automatico
    if (process.env.GIT_AUTO_COMMIT === 'true') {
      await gitService.autoCommit(`Creato ${type} #${result.id} [by ${session.userEmail}]`);
    }

    res.status(201).json(result);
  } catch (error: any) {
    console.error('[Content] Errore creazione:', error.message);
    res.status(500).json({ error: 'Errore creazione' });
  }
});

/**
 * DELETE /api/content/:type/:id
 * Elimina un item
 * RICHIEDE AUTENTICAZIONE
 */
app.delete('/api/content/:type/:id', requireAuth, async (req, res) => {
  try {
    const { type, id } = req.params;
    const session = (req as any).session;

    console.log(`[Content] User ${session.userEmail} deleting ${type} #${id}`);

    const result = await contentService.removeItem(type as any, parseInt(id as string), 'api');

    if (!result) {
      return res.status(404).json({ error: 'Item non trovato' });
    }

    // Commit automatico
    if (process.env.GIT_AUTO_COMMIT === 'true') {
      await gitService.autoCommit(`Eliminato ${type} #${id} [by ${session.userEmail}]`);
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('[Content] Errore eliminazione:', error.message);
    res.status(500).json({ error: 'Errore eliminazione' });
  }
});

// ============================================
// ROUTES - UPLOAD
// ============================================

/**
 * POST /api/upload/:category
 * Carica un'immagine
 * RICHIEDE AUTENTICAZIONE
 */
app.post('/api/upload/:category', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { category } = req.params;
    const session = (req as any).session;
    const categoryStr = Array.isArray(category) ? category[0] : category;
    const validCategories = ['wines', 'news', 'tenute', 'experiences', 'gallery'];

    if (!validCategories.includes(categoryStr)) {
      return res.status(400).json({ error: 'Categoria non valida' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Nessun file caricato' });
    }

    console.log(`[Upload] User ${session.userEmail} uploading to ${categoryStr}`);

    const result = await uploadService.upload(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      categoryStr as any
    );

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json(result);
  } catch (error: any) {
    console.error('[Upload] Errore:', error.message);
    res.status(500).json({ error: 'Errore upload' });
  }
});

/**
 * DELETE /api/upload
 * Elimina un'immagine
 * RICHIEDE AUTENTICAZIONE
 */
app.delete('/api/upload', requireAuth, async (req, res) => {
  try {
    const { path: imagePath } = req.body;
    const session = (req as any).session;

    if (!imagePath) {
      return res.status(400).json({ error: 'Path richiesto' });
    }

    console.log(`[Upload] User ${session.userEmail} deleting ${imagePath}`);

    const result = await uploadService.delete(imagePath);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('[Upload] Errore eliminazione:', error.message);
    res.status(500).json({ error: 'Errore eliminazione' });
  }
});

/**
 * GET /api/upload/:category
 * Lista immagini di una categoria
 */
app.get('/api/upload/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const images = await uploadService.list(category as any);
    res.json(images);
  } catch (error: any) {
    console.error('[Upload] Errore lista:', error.message);
    res.status(500).json({ error: 'Errore lista immagini' });
  }
});

// ============================================
// ROUTES - GIT/HISTORY
// ============================================

/**
 * GET /api/history
 * Ottiene la storia delle modifiche
 */
app.get('/api/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const history = await gitService.getHistory(limit);
    res.json(history);
  } catch (error: any) {
    console.error('[History] Errore:', error.message);
    res.status(500).json({ error: 'Errore recupero storia' });
  }
});

/**
 * POST /api/history/rollback
 * Ripristina una versione precedente
 * RICHIEDE AUTENTICAZIONE
 */
app.post('/api/history/rollback', requireAuth, async (req, res) => {
  try {
    const { commitHash } = req.body;
    const session = (req as any).session;

    if (!commitHash) {
      return res.status(400).json({ error: 'Commit hash richiesto' });
    }

    console.log(`[History] User ${session.userEmail} rolling back to ${commitHash}`);

    const result = await gitService.restoreContent(commitHash);

    if (!result) {
      return res.status(500).json({ error: 'Errore rollback' });
    }

    res.json({ success: true, message: `Rollback a ${commitHash} completato` });
  } catch (error: any) {
    console.error('[History] Errore rollback:', error.message);
    res.status(500).json({ error: 'Errore rollback' });
  }
});

// ============================================
// ROUTES - STATUS
// ============================================

/**
 * GET /status
 * Endpoint per Business Tuner connection test
 * Usa X-BT-API-Key header per autenticazione
 */
app.get('/status', (req, res) => {
  const apiKey = req.headers['x-bt-api-key'];
  const expectedKey = process.env.BUSINESS_TUNER_API_KEY;

  if (!expectedKey) {
    console.error('[Status] BUSINESS_TUNER_API_KEY non configurata');
    return res.status(500).json({
      error: 'Configuration Error',
      message: 'Server not properly configured'
    });
  }

  if (!apiKey || apiKey !== expectedKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing API key'
    });
  }

  res.json({
    status: 'ok',
    version: '1.0.0',
    capabilities: ['suggestions', 'content-sync', 'webhooks'],
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/status
 * Stato del CMS
 */
app.get('/api/status', async (req, res) => {
  try {
    const gitStatus = await gitService.getStatus();

    res.json({
      status: 'ok',
      version: '1.0.0',
      git: gitStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// ============================================
// ROUTES - BUSINESS TUNER INTEGRATION
// ============================================

/**
 * GET /api/integration/status
 * Verifica stato integrazione Business Tuner
 */
app.get('/api/integration/status', btAuth, (req, res) => {
  integrationController.getStatus(req, res);
});

/**
 * POST /api/integration/suggestions
 * Riceve suggerimenti da Business Tuner
 */
app.post('/api/integration/suggestions', btAuth, (req, res) => {
  integrationController.receiveSuggestions(req, res);
});

/**
 * GET /api/integration/content
 * Esporta contenuti per Business Tuner
 */
app.get('/api/integration/content', btAuth, (req, res) => {
  integrationController.getContent(req, res);
});

/**
 * POST /api/integration/config
 * Aggiorna configurazione integrazione
 */
app.post('/api/integration/config', btAuth, (req, res) => {
  integrationController.updateConfig(req, res);
});

/**
 * POST /api/integration/suggestions/:id/apply
 * Applica un suggerimento ricevuto (da BT)
 */
app.post('/api/integration/suggestions/:id/apply', btAuth, (req, res) => {
  integrationController.applySuggestion(req, res);
});

/**
 * POST /api/integration/test-webhook
 * Test connessione webhook
 */
app.post('/api/integration/test-webhook', btAuth, (req, res) => {
  integrationController.testWebhook(req, res);
});

// ============================================
// ROUTES - SUGGESTIONS (per utenti autenticati)
// ============================================

/**
 * GET /api/suggestions
 * Lista suggerimenti per la dashboard
 * RICHIEDE AUTENTICAZIONE
 */
app.get('/api/suggestions', requireAuth, (req, res) => {
  integrationController.listSuggestions(req, res);
});

/**
 * GET /api/suggestions/:id
 * Dettaglio singolo suggerimento
 * RICHIEDE AUTENTICAZIONE
 */
app.get('/api/suggestions/:id', requireAuth, (req, res) => {
  integrationController.getSuggestion(req, res);
});

/**
 * POST /api/suggestions/:id/apply
 * Applica suggerimento dalla dashboard
 * RICHIEDE AUTENTICAZIONE
 */
app.post('/api/suggestions/:id/apply', requireAuth, (req, res) => {
  integrationController.applySuggestionByUser(req, res);
});

/**
 * POST /api/suggestions/:id/reject
 * Rifiuta suggerimento dalla dashboard
 * RICHIEDE AUTENTICAZIONE
 */
app.post('/api/suggestions/:id/reject', requireAuth, (req, res) => {
  integrationController.rejectSuggestion(req, res);
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🍷 Chiarli CMS Server                               ║
║                                                       ║
║   Server avviato su http://localhost:${PORT}            ║
║                                                       ║
║   Endpoints:                                          ║
║   - POST /api/chat          Chat con assistente       ║
║   - POST /api/chat/confirm  Conferma azione           ║
║   - GET  /api/content/:type Leggi contenuti           ║
║   - POST /api/upload/:cat   Upload immagini           ║
║   - GET  /api/history       Storia modifiche          ║
║                                                       ║
║   Business Tuner Integration:                         ║
║   - GET  /api/integration/status                      ║
║   - POST /api/integration/suggestions                 ║
║   - GET  /api/integration/content                     ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

export default app;
