import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Carica variabili d'ambiente
dotenv.config();

import { contentService } from './services/content.service.js';
import { claudeService } from './services/claude.service.js';
import { gitService } from './services/git.service.js';
import { uploadService } from './services/upload.service.js';
import { btAuth } from './middleware/btAuth.js';
import { integrationController } from './controllers/integration.controller.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3002', // Dashboard CMS
  ],
  credentials: true,
}));

// IMPORTANTE: Route PDF DEVE venire PRIMA di express.json() per evitare conflitti
/**
 * POST /api/upload/pdf
 * Carica e analizza un PDF (scheda tecnica vino)
 * Usa un handler personalizzato per evitare conflitti con Multer
 */
app.post('/api/upload/pdf', express.raw({ type: 'application/pdf', limit: '10mb' }), async (req, res) => {
  try {
    console.log('[Upload/PDF] Richiesta ricevuta');
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
// ROUTES - CHAT
// ============================================

/**
 * POST /api/chat
 * Endpoint principale per la chat con l'assistente
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Messaggio richiesto' });
    }

    const response = await claudeService.processMessage(message);

    res.json(response);
  } catch (error: any) {
    console.error('[Chat] Errore:', error.message);
    res.status(500).json({ error: 'Errore elaborazione messaggio' });
  }
});

/**
 * POST /api/chat/confirm
 * Conferma ed esegue un'azione
 */
app.post('/api/chat/confirm', async (req, res) => {
  try {
    const { action } = req.body;

    if (!action) {
      return res.status(400).json({ error: 'Azione richiesta' });
    }

    // Esegui l'azione
    const result = await claudeService.executeAction(action);

    // Se successo, crea commit automatico
    if (result.success && process.env.GIT_AUTO_COMMIT === 'true') {
      await gitService.autoCommit(`${action.type} ${action.contentType}${action.itemId ? ` #${action.itemId}` : ''}`);
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
 */
app.post('/api/chat/reset', (req, res) => {
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
 * PUT /api/content/:type/:id
 * Aggiorna un item specifico
 */
app.put('/api/content/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    const updates = req.body;

    const result = await contentService.updateItem(type as any, parseInt(id), updates, 'api');

    if (!result) {
      return res.status(404).json({ error: 'Item non trovato' });
    }

    // Commit automatico
    if (process.env.GIT_AUTO_COMMIT === 'true') {
      await gitService.autoCommit(`Aggiornato ${type} #${id}`);
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
 */
app.post('/api/content/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const item = req.body;

    const result = await contentService.addItem(type as any, item, 'api');

    // Commit automatico
    if (process.env.GIT_AUTO_COMMIT === 'true') {
      await gitService.autoCommit(`Creato ${type} #${result.id}`);
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
 */
app.delete('/api/content/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;

    const result = await contentService.removeItem(type as any, parseInt(id), 'api');

    if (!result) {
      return res.status(404).json({ error: 'Item non trovato' });
    }

    // Commit automatico
    if (process.env.GIT_AUTO_COMMIT === 'true') {
      await gitService.autoCommit(`Eliminato ${type} #${id}`);
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
 */
app.post('/api/upload/:category', upload.single('image'), async (req, res) => {
  try {
    const { category } = req.params;
    const categoryStr = Array.isArray(category) ? category[0] : category;
    const validCategories = ['wines', 'news', 'tenute', 'experiences', 'gallery'];

    if (!validCategories.includes(categoryStr)) {
      return res.status(400).json({ error: 'Categoria non valida' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Nessun file caricato' });
    }

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
 */
app.delete('/api/upload', async (req, res) => {
  try {
    const { path: imagePath } = req.body;

    if (!imagePath) {
      return res.status(400).json({ error: 'Path richiesto' });
    }

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
 */
app.post('/api/history/rollback', async (req, res) => {
  try {
    const { commitHash } = req.body;

    if (!commitHash) {
      return res.status(400).json({ error: 'Commit hash richiesto' });
    }

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
 * Applica un suggerimento ricevuto
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
