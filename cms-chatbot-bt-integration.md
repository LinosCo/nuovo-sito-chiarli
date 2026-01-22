# CMS Chatbot - Business Tuner Integration

## Obiettivo

Estendere il CMS Chatbot esistente per supportare l'integrazione con Business Tuner. Le modifiche permettono di:

1. Autenticare le richieste da Business Tuner tramite API key
2. Ricevere suggerimenti di contenuto e crearli come bozze
3. Notificare Business Tuner quando i contenuti vengono pubblicati
4. Esporre lista contenuti per sincronizzazione

**NOTA**: Google Analytics e Search Console sono gestiti interamente da Business Tuner. Il CMS non ha bisogno di integrare Google.

---

## Architettura Integrazione

```
BUSINESS TUNER                                    CMS CHATBOT
     │                                                 │
     │  ─── GET /api/integration/status ─────────────►│  Health check
     │  ◄── { connected, version, capabilities } ─────│
     │                                                 │
     │  ─── POST /api/integration/suggestions ───────►│  Crea bozza
     │  ◄── { id, status, previewUrl } ───────────────│
     │                                                 │
     │  ─── GET /api/integration/content ────────────►│  Lista contenuti
     │  ◄── { contents: [...] } ──────────────────────│
     │                                                 │
     │  ─── POST /api/integration/config ────────────►│  Sync branding/URLs
     │  ◄── { success } ──────────────────────────────│
     │                                                 │
     │  ◄── POST /webhooks/cms/{connId} ──────────────│  Notifica pubblicazione
     │      (quando utente pubblica contenuto)         │
     │                                                 │
```

---

## 1. Autenticazione API

### 1.1 Middleware di autenticazione

Crea un middleware per autenticare le richieste da Business Tuner.

```typescript
// middleware/btAuth.ts

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export function btApiAuth(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-bt-api-key'] as string;
  
  if (!apiKey) {
    return res.status(401).json({ 
      error: 'UNAUTHORIZED',
      message: 'Missing X-BT-API-Key header' 
    });
  }
  
  // Valida API key (configurata in .env)
  // Usa timing-safe comparison per prevenire timing attacks
  const expectedKey = process.env.BUSINESS_TUNER_API_KEY || '';
  
  if (!timingSafeEqual(apiKey, expectedKey)) {
    console.warn('[BT Auth] Invalid API key attempt');
    return res.status(401).json({ 
      error: 'INVALID_API_KEY',
      message: 'Invalid API key' 
    });
  }
  
  // Marca la richiesta come proveniente da Business Tuner
  req.isBusinessTuner = true;
  
  next();
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Esegui comunque il confronto per evitare timing leak sulla lunghezza
    crypto.timingSafeEqual(Buffer.from(a), Buffer.from(a));
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

// Estendi il tipo Request
declare global {
  namespace Express {
    interface Request {
      isBusinessTuner?: boolean;
    }
  }
}
```

### 1.2 Environment Variables

Aggiungi al `.env`:

```bash
# ═══════════════════════════════════════════════════════
# BUSINESS TUNER INTEGRATION
# ═══════════════════════════════════════════════════════

# API Key fornita da Voler.ai admin (durante setup connessione)
BUSINESS_TUNER_API_KEY=bt_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Webhook per notificare BT quando pubblichiamo contenuti
BUSINESS_TUNER_WEBHOOK_URL=https://api.businesstuner.io/webhooks/cms/conn_xxx
BUSINESS_TUNER_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx

# URL di Business Tuner (per link di navigazione)
BUSINESS_TUNER_URL=https://app.businesstuner.io
```

---

## 2. Nuovi Endpoint Integration

Crea un nuovo router per gli endpoint di integrazione.

```typescript
// routes/integration.ts

import { Router } from 'express';
import { btApiAuth } from '../middleware/btAuth';
import { integrationController } from '../controllers/integration.controller';

const router = Router();

// Tutti gli endpoint richiedono autenticazione Business Tuner
router.use(btApiAuth);

// Health check e capabilities
router.get('/status', integrationController.getStatus);

// Ricevi suggerimenti e crea bozze
router.post('/suggestions', integrationController.createSuggestion);

// Lista contenuti (per verificare pubblicazioni)
router.get('/content', integrationController.listContent);

// Dettaglio singolo contenuto
router.get('/content/:id', integrationController.getContent);

// Ricevi configurazione (branding, URLs)
router.post('/config', integrationController.updateConfig);
router.get('/config', integrationController.getConfig);

export default router;
```

### 2.1 GET /api/integration/status

Restituisce lo stato della connessione e le capabilities supportate.

```typescript
// controllers/integration.controller.ts

interface StatusResponse {
  connected: true;
  version: string;
  capabilities: string[];
  contentTypes: string[];
}

async getStatus(req: Request, res: Response) {
  res.json({
    connected: true,
    version: '1.0.0',
    capabilities: [
      'suggestions',           // Può ricevere suggerimenti
      'content_create',        // Può creare contenuti
      'content_read',          // Può leggere contenuti
      'content_publish',       // Può pubblicare contenuti
      'webhook_notify',        // Notifica pubblicazioni a BT
      'branding_sync',         // Può ricevere branding da BT
    ],
    contentTypes: ['pages', 'news', 'faq', 'wines', 'experiences'],
  });
}
```

### 2.2 POST /api/integration/suggestions

Riceve un suggerimento da Business Tuner e lo crea come bozza.

```typescript
// Request
interface CreateSuggestionRequest {
  type: 'CREATE_PAGE' | 'CREATE_FAQ' | 'CREATE_BLOG_POST' | 'MODIFY_CONTENT' | 'ADD_SECTION';
  title: string;
  slug?: string;
  body: string;
  metaDescription?: string;
  targetSection?: string;  // 'news', 'faq', 'pages', etc.
  reasoning: string;       // Spiegazione per l'utente del CMS
  sourceInsightId?: string; // ID insight in Business Tuner (per tracking)
  priority?: 'high' | 'medium' | 'low';
}

// Response
interface CreateSuggestionResponse {
  success: true;
  id: string;                    // ID nel CMS
  status: 'draft';
  previewUrl: string | null;     // URL per preview (se disponibile)
  message: string;
}

async createSuggestion(req: Request, res: Response) {
  const { type, title, slug, body, metaDescription, targetSection, reasoning, sourceInsightId, priority } = req.body;
  
  // Validazione
  if (!type || !title || !body) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'type, title, and body are required'
    });
  }
  
  try {
    // Determina dove creare il contenuto
    const contentType = mapTypeToContentType(type, targetSection);
    
    // Crea bozza nel sistema di contenuti
    const draft = await contentService.createDraft({
      contentType,
      data: {
        title,
        slug: slug || generateSlug(title),
        body,
        metaDescription,
        status: 'draft',
        // Metadata Business Tuner
        _btSuggestion: {
          sourceInsightId,
          reasoning,
          priority: priority || 'medium',
          receivedAt: new Date().toISOString(),
        }
      }
    });
    
    // Commit automatico se git enabled
    if (process.env.GIT_AUTO_COMMIT === 'true') {
      await gitService.autoCommit(
        `[BT] Bozza suggerita: ${title}`,
        [`content/${contentType}.json`]
      );
    }
    
    // Genera preview URL se possibile
    const previewUrl = generatePreviewUrl(contentType, draft.id, draft.slug);
    
    res.status(201).json({
      success: true,
      id: draft.id,
      status: 'draft',
      previewUrl,
      message: `Bozza "${title}" creata in ${contentType}`
    });
    
  } catch (error) {
    console.error('[Integration] Errore creazione suggerimento:', error);
    res.status(500).json({
      error: 'CREATE_FAILED',
      message: error.message
    });
  }
}

// Helpers
function mapTypeToContentType(type: string, targetSection?: string): string {
  if (targetSection) return targetSection;
  
  const mapping: Record<string, string> = {
    'CREATE_PAGE': 'pages',
    'CREATE_FAQ': 'faq',
    'CREATE_BLOG_POST': 'news',
    'MODIFY_CONTENT': 'pages',
    'ADD_SECTION': 'pages',
  };
  return mapping[type] || 'pages';
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[àáâäã]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôöõ]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function generatePreviewUrl(contentType: string, id: string, slug: string): string | null {
  const baseUrl = process.env.SITE_PREVIEW_URL || process.env.FRONTEND_URL;
  if (!baseUrl) return null;
  
  // Adatta in base alla struttura URL del sito
  const paths: Record<string, string> = {
    'news': `/news/${slug}?preview=true`,
    'faq': `/faq?preview=${id}`,
    'pages': `/${slug}?preview=true`,
  };
  
  return `${baseUrl}${paths[contentType] || `/${slug}?preview=true`}`;
}
```

### 2.4 Webhook: Notifica pubblicazione a Business Tuner

Quando un contenuto viene pubblicato nel CMS (manualmente o tramite chat), notifica Business Tuner.

```typescript
// services/bt-webhook.service.ts

import crypto from 'crypto';

interface PublishEvent {
  event: 'content.published';
  contentId: string;
  contentType: string;
  title: string;
  slug: string;
  url: string;
  btSuggestionId?: string;  // Se era un suggerimento BT
  publishedAt: string;
}

export class BTWebhookService {
  private webhookUrl: string;
  private webhookSecret: string;
  
  constructor() {
    this.webhookUrl = process.env.BUSINESS_TUNER_WEBHOOK_URL || '';
    this.webhookSecret = process.env.BUSINESS_TUNER_WEBHOOK_SECRET || '';
  }
  
  /**
   * Notifica BT quando un contenuto viene pubblicato
   */
  async notifyContentPublished(content: {
    id: string;
    type: string;
    title: string;
    slug: string;
    btSuggestionId?: string;
  }): Promise<void> {
    if (!this.webhookUrl) {
      console.log('[BT Webhook] URL non configurato, skip notifica');
      return;
    }
    
    const siteUrl = process.env.FRONTEND_URL || '';
    const publicUrl = this.buildPublicUrl(content.type, content.slug, siteUrl);
    
    const payload: PublishEvent = {
      event: 'content.published',
      contentId: content.id,
      contentType: content.type,
      title: content.title,
      slug: content.slug,
      url: publicUrl,
      btSuggestionId: content.btSuggestionId,
      publishedAt: new Date().toISOString(),
    };
    
    const signature = this.signPayload(payload);
    
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CMS-Signature': `sha256=${signature}`,
          'X-CMS-Event': 'content.published',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        console.error('[BT Webhook] Errore risposta:', response.status);
      } else {
        console.log('[BT Webhook] Notifica inviata:', content.title);
      }
    } catch (error) {
      console.error('[BT Webhook] Errore invio:', error);
      // Non bloccare la pubblicazione se il webhook fallisce
    }
  }
  
  private signPayload(payload: object): string {
    return crypto
      .createHmac('sha256', this.webhookSecret)
      .update(JSON.stringify(payload))
      .digest('hex');
  }
  
  private buildPublicUrl(type: string, slug: string, baseUrl: string): string {
    const paths: Record<string, string> = {
      news: `/news/${slug}`,
      faq: `/faq#${slug}`,
      pages: `/${slug}`,
      wines: `/vini/${slug}`,
      experiences: `/esperienze/${slug}`,
    };
    return `${baseUrl}${paths[type] || `/${slug}`}`;
  }
}

export const btWebhookService = new BTWebhookService();
```

### 2.5 Integrazione webhook nel Content Service

Modifica il content service per notificare BT quando si pubblica.

```typescript
// services/content.service.ts - modifica a updateStatus

import { btWebhookService } from './bt-webhook.service';

/**
 * Aggiorna lo status di un contenuto (draft -> published)
 */
async updateStatus(
  contentType: string, 
  id: number, 
  status: 'draft' | 'published'
): Promise<any> {
  const updates: any = { 
    status,
    updatedAt: new Date().toISOString(),
  };
  
  if (status === 'published') {
    updates.publishedAt = new Date().toISOString();
  }
  
  const item = await this.updateItem(contentType, id, updates, 'cms');
  
  // Se stiamo pubblicando, notifica Business Tuner
  if (status === 'published' && item) {
    await btWebhookService.notifyContentPublished({
      id: String(item.id),
      type: contentType,
      title: item.title || item.name,
      slug: item.slug,
      btSuggestionId: item._btSuggestion?.sourceInsightId,
    });
  }
  
  return item;
}
```

### 2.6 Hook nel Claude Service per pubblicazione via chat

Quando l'utente pubblica via chat, triggerare il webhook.

```typescript
// services/claude.service.ts - nella funzione executeAction

async executeAction(action: CMSAction): Promise<{ success: boolean; message: string }> {
  // ... logica esistente ...
  
  // Se l'azione è update e include status: published
  if (action.type === 'update' && action.data?.status === 'published') {
    const item = await contentService.read(action.contentType);
    const updated = items.find(i => i.id === action.itemId);
    
    if (updated) {
      await btWebhookService.notifyContentPublished({
        id: String(updated.id),
        type: action.contentType,
        title: updated.title || updated.name,
        slug: updated.slug,
        btSuggestionId: updated._btSuggestion?.sourceInsightId,
      });
    }
  }
  
  return { success: true, message: 'Azione completata' };
}
```

---

## 4. Content Service Extensions

Lista i contenuti per permettere a Business Tuner di verificare le pubblicazioni.

```typescript
// Request query params
interface ContentQuery {
  type?: string;           // 'news', 'faq', 'pages', etc.
  status?: 'draft' | 'published' | 'all';
  since?: string;          // ISO date - contenuti modificati dopo questa data
  btOnly?: boolean;        // Solo contenuti creati da Business Tuner
}

// Response
interface ContentListResponse {
  contents: {
    id: string;
    type: string;
    title: string;
    slug: string;
    status: 'draft' | 'published';
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    url?: string;           // URL pubblico se pubblicato
    btSourceInsightId?: string;  // Se creato da Business Tuner
  }[];
  total: number;
}

async listContent(req: Request, res: Response) {
  const { type, status, since, btOnly } = req.query;
  
  const contents = [];
  const contentTypes = type 
    ? [type as string] 
    : ['news', 'faq', 'pages', 'wines', 'experiences'];
  
  for (const ct of contentTypes) {
    try {
      const items = await contentService.read(ct);
      const itemList = Array.isArray(items) ? items : items[ct] || [];
      
      for (const item of itemList) {
        // Filtra per status
        if (status && status !== 'all' && item.status !== status) continue;
        
        // Filtra per data
        if (since && new Date(item.updatedAt || item.createdAt) < new Date(since as string)) continue;
        
        // Filtra per origine BT
        if (btOnly === 'true' && !item._btSuggestion) continue;
        
        contents.push({
          id: String(item.id),
          type: ct,
          title: item.title || item.name,
          slug: item.slug || generateSlug(item.title || item.name),
          status: item.status || 'published',
          createdAt: item.createdAt || item._meta?.lastModified,
          updatedAt: item.updatedAt || item._meta?.lastModified,
          publishedAt: item.publishedAt,
          url: item.status === 'published' ? getPublicUrl(ct, item) : undefined,
          btSourceInsightId: item._btSuggestion?.sourceInsightId,
        });
      }
    } catch (error) {
      console.error(`[Content] Error reading ${ct}:`, error);
    }
  }
  
  res.json({
    contents,
    total: contents.length,
  });
}
```

---

## 5. Registra le Routes

Aggiorna `server.ts` per includere le nuove routes.

```typescript
// server.ts - aggiunte

import integrationRouter from './routes/integration';

// ... dopo le altre routes ...

// Integration API (Business Tuner)
app.use('/api/integration', integrationRouter);

// Aggiorna il banner di startup
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🌐 CMS Server v1.1.0                                        ║
║                                                               ║
║   Server avviato su http://localhost:${PORT}                    ║
║                                                               ║
║   Endpoints:                                                  ║
║   - POST /api/chat              Chat con assistente           ║
║   - POST /api/chat/confirm      Conferma azione               ║
║   - GET  /api/content/:type     Leggi contenuti               ║
║   - POST /api/upload/:cat       Upload immagini               ║
║   - GET  /api/history           Storia modifiche              ║
║                                                               ║
║   Integration API (Business Tuner):                           ║
║   - GET  /api/integration/status      Health check            ║
║   - POST /api/integration/suggestions Ricevi suggerimenti     ║
║   - GET  /api/integration/content     Lista contenuti         ║
║   - POST /api/integration/config      Sync configurazione     ║
║                                                               ║
║   Business Tuner: ${process.env.BUSINESS_TUNER_URL || 'non configurato'}
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});
```

---

## 6. Environment Variables Complete

```bash
# .env completo per integrazione

# Anthropic API Key (esistente)
ANTHROPIC_API_KEY=sk-ant-...

# Server
PORT=3001
NODE_ENV=production

# Paths
CONTENT_PATH=../content
UPLOADS_PATH=../public/uploads
SITE_PATH=..

# Frontend URL (per CORS e preview URLs)
FRONTEND_URL=https://www.example.com
SITE_PREVIEW_URL=https://www.example.com

# Git (esistente)
GIT_AUTO_COMMIT=true
GIT_AUTHOR_NAME=CMS Bot
GIT_AUTHOR_EMAIL=cms@example.com

# ═══════════════════════════════════════════════════════
# BUSINESS TUNER INTEGRATION
# ═══════════════════════════════════════════════════════

# API Key fornita da Voler.ai admin (durante setup in Business Tuner)
BUSINESS_TUNER_API_KEY=bt_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Webhook per notificare BT quando pubblichiamo contenuti
BUSINESS_TUNER_WEBHOOK_URL=https://api.businesstuner.io/webhooks/cms/conn_xxx
BUSINESS_TUNER_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx

# URL di Business Tuner (per link di navigazione nel frontend)
BUSINESS_TUNER_URL=https://app.businesstuner.io
```

**NOTA**: Le credenziali `BUSINESS_TUNER_*` vengono fornite da Voler.ai durante il setup della connessione nel pannello admin di Business Tuner. Non è necessaria alcuna configurazione Google nel CMS.

---

## 7. Testing

### 7.1 Test Status Endpoint

```bash
curl -X GET http://localhost:3001/api/integration/status \
  -H "X-BT-API-Key: bt_live_xxx"
```

Expected response:
```json
{
  "connected": true,
  "version": "1.0.0",
  "capabilities": ["suggestions", "content_create", "content_read", "content_publish", "webhook_notify", "branding_sync"],
  "contentTypes": ["pages", "news", "faq", "wines", "experiences"]
}
```

### 7.2 Test Create Suggestion

```bash
curl -X POST http://localhost:3001/api/integration/suggestions \
  -H "X-BT-API-Key: bt_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "CREATE_FAQ",
    "title": "Quali sono i tempi di consegna?",
    "body": "I tempi di consegna standard sono...",
    "reasoning": "47 domande sul chatbot relative ai tempi di consegna",
    "priority": "high"
  }'
```

Expected response:
```json
{
  "success": true,
  "id": "42",
  "status": "draft",
  "previewUrl": "https://example.com/faq?preview=42",
  "message": "Bozza \"Quali sono i tempi di consegna?\" creata in faq"
}
```

### 7.3 Test Content List

```bash
curl -X GET "http://localhost:3001/api/integration/content?status=draft&btOnly=true" \
  -H "X-BT-API-Key: bt_live_xxx"
```

### 7.4 Test Webhook Signature (manuale)

```bash
# Simula pubblicazione e verifica che il webhook parta
# Nel CMS, pubblica un contenuto e controlla i log per:
# "[BT Webhook] Notifica inviata: <titolo>"
```

---

## 8. Security Checklist

1. [ ] API key validata su ogni richiesta integration (timing-safe comparison)
2. [ ] Webhook firmati con HMAC-SHA256
3. [ ] Rate limiting sugli endpoint integration (es. 100 req/min)
4. [ ] Logging di tutte le operazioni integration
5. [ ] Validazione input su suggestions (sanitize HTML, length limits)
6. [ ] CORS configurato per accettare solo origini note
7. [ ] API key mai loggata o esposta in errori

---

## 9. Migration Checklist

1. [ ] Installa dipendenze (`npm install`) - nessuna nuova dipendenza richiesta
2. [ ] Crea middleware `middleware/btAuth.ts`
3. [ ] Crea service `services/bt-webhook.service.ts`
4. [ ] Estendi `services/content.service.ts` con metodi bozze e webhook
5. [ ] Crea controller `controllers/integration.controller.ts`
6. [ ] Crea router `routes/integration.ts`
7. [ ] Registra router in `server.ts`
8. [ ] Ricevi credenziali da Voler.ai e configura `.env`
9. [ ] Test tutti gli endpoint
10. [ ] Deploy

---

## 10. Note Implementative

1. **Nessuna integrazione Google**: Analytics e Search Console sono gestiti interamente da Business Tuner. Il CMS si limita a gestire contenuti e notificare pubblicazioni.

2. **Webhook resiliente**: Se il webhook a Business Tuner fallisce, la pubblicazione non viene bloccata. Il CMS logga l'errore e continua.

3. **Slug collision**: Prima di creare una bozza, verifica che lo slug non esista già. In caso, aggiungi un suffisso numerico.

4. **Preview URL**: Il formato dell'URL di preview dipende dalla struttura del sito. Potrebbe servire configurazione per sito.

5. **Timing-safe comparison**: L'API key viene confrontata con `crypto.timingSafeEqual` per prevenire timing attacks.

Estendi il content service esistente per supportare le bozze.

```typescript
// services/content.service.ts - aggiunte

interface DraftData {
  contentType: string;
  data: {
    title: string;
    slug: string;
    body: string;
    metaDescription?: string;
    status: 'draft' | 'published';
    _btSuggestion?: {
      sourceInsightId?: string;
      reasoning: string;
      priority: string;
      receivedAt: string;
    };
  };
}

export class ContentService {
  // ... metodi esistenti ...
  
  /**
   * Crea una bozza di contenuto
   */
  async createDraft(draft: DraftData) {
    const { contentType, data } = draft;
    
    // Leggi contenuti esistenti
    const existing = await this.read(contentType);
    const items = Array.isArray(existing) ? existing : existing[contentType] || [];
    
    // Genera nuovo ID
    const maxId = items.reduce((max: number, item: any) => 
      Math.max(max, item.id || 0), 0);
    const newId = maxId + 1;
    
    // Crea item con metadata
    const newItem = {
      id: newId,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Aggiungi e salva
    items.push(newItem);
    
    const toSave = Array.isArray(existing) 
      ? items 
      : { ...existing, [contentType]: items };
    
    await this.write(contentType, toSave, 'business-tuner');
    
    return newItem;
  }
  
  /**
   * Aggiorna lo status di un contenuto (draft -> published)
   */
  async updateStatus(contentType: string, id: number, status: 'draft' | 'published') {
    const updates: any = { 
      status,
      updatedAt: new Date().toISOString(),
    };
    
    if (status === 'published') {
      updates.publishedAt = new Date().toISOString();
    }
    
    return this.updateItem(contentType, id, updates, 'cms');
  }
  
  /**
   * Trova contenuti creati da Business Tuner
   */
  async findBTSuggestions(options?: { status?: string; since?: Date }) {
    const allContent = [];
    const types = ['news', 'faq', 'pages'];
    
    for (const type of types) {
      try {
        const data = await this.read(type);
        const items = Array.isArray(data) ? data : data[type] || [];
        
        const filtered = items.filter((item: any) => {
          if (!item._btSuggestion) return false;
          if (options?.status && item.status !== options.status) return false;
          if (options?.since && new Date(item.createdAt) < options.since) return false;
          return true;
        });
        
        allContent.push(...filtered.map((item: any) => ({ ...item, _contentType: type })));
      } catch (e) {
        // tipo non esistente, skip
      }
    }
    
    return allContent;
  }
}
```

---

## 6. Registra le Routes

Aggiorna `server.ts` per includere le nuove routes.

```typescript
// server.ts - aggiunte

import integrationRouter from './routes/integration';

// ... dopo le altre routes ...

// Integration API (Business Tuner)
app.use('/api/integration', integrationRouter);

// Aggiorna il banner di startup
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🌐 CMS Server v1.1.0                                        ║
║                                                               ║
║   Server avviato su http://localhost:${PORT}                    ║
║                                                               ║
║   Endpoints:                                                  ║
║   - POST /api/chat              Chat con assistente           ║
║   - POST /api/chat/confirm      Conferma azione               ║
║   - GET  /api/content/:type     Leggi contenuti               ║
║   - POST /api/upload/:cat       Upload immagini               ║
║   - GET  /api/history           Storia modifiche              ║
║                                                               ║
║   Integration API (Business Tuner):                           ║
║   - GET  /api/integration/status      Health check            ║
║   - POST /api/integration/suggestions Ricevi suggerimenti     ║
║   - GET  /api/integration/analytics   Metriche sito           ║
║   - GET  /api/integration/content     Lista contenuti         ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});
```

---

## 7. Dependencies

Nessuna dipendenza aggiuntiva richiesta per l'integrazione con Business Tuner.

Le dipendenze esistenti del CMS (Express, Anthropic SDK, etc.) sono sufficienti.

**NOTA**: Google Analytics e Search Console sono gestiti interamente da Business Tuner. Il CMS non necessita delle librerie Google.
```

---

## 8. Environment Variables Complete

```bash
# .env completo per integrazione

# Anthropic API Key (esistente)
ANTHROPIC_API_KEY=sk-ant-...

# Server
PORT=3001
NODE_ENV=production

# Paths
CONTENT_PATH=../content
UPLOADS_PATH=../public/uploads
SITE_PATH=..

# Frontend URL (per CORS e preview URLs)
FRONTEND_URL=https://example.com
SITE_PREVIEW_URL=https://example.com

# Git (esistente)
GIT_AUTO_COMMIT=true
GIT_AUTHOR_NAME=CMS Bot
GIT_AUTHOR_EMAIL=cms@example.com

# ═══════════════════════════════════════════════════════
# BUSINESS TUNER INTEGRATION
# ═══════════════════════════════════════════════════════

# API Key fornita da Voler.ai admin (durante setup connessione in BT)
BUSINESS_TUNER_API_KEY=bt_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Webhook per notificare Business Tuner quando pubblichiamo contenuti
BUSINESS_TUNER_WEBHOOK_URL=https://api.businesstuner.io/webhooks/cms/conn_xxx
BUSINESS_TUNER_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx

# URL di Business Tuner (per link di navigazione nella UI)
BUSINESS_TUNER_URL=https://app.businesstuner.io
```

**NOTA**: Le credenziali `BUSINESS_TUNER_*` vengono fornite da Voler.ai durante il setup della connessione nel pannello admin di Business Tuner. Non serve alcuna configurazione Google nel CMS.

---

## 9. Testing

### 9.1 Test Status Endpoint

```bash
curl -X GET http://localhost:3001/api/integration/status \
  -H "X-BT-API-Key: bt_live_xxx"
```

Expected response:
```json
{
  "connected": true,
  "version": "1.0.0",
  "capabilities": ["suggestions", "content_create", "content_read", "analytics_ga", "analytics_sc"],
  "contentTypes": ["pages", "news", "faq", "wines", "experiences"],
  "analytics": {
    "googleAnalytics": true,
    "searchConsole": true
  }
}
```

### 9.2 Test Create Suggestion

```bash
curl -X POST http://localhost:3001/api/integration/suggestions \
  -H "X-BT-API-Key: bt_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "CREATE_FAQ",
    "title": "Quali sono i tempi di consegna?",
    "body": "I tempi di consegna standard sono...",
    "reasoning": "47 domande sul chatbot relative ai tempi di consegna",
    "priority": "high"
  }'
```

Expected response:
```json
{
  "success": true,
  "id": "42",
  "status": "draft",
  "previewUrl": "https://example.com/faq?preview=42",
  "message": "Bozza \"Quali sono i tempi di consegna?\" creata in faq"
}
```

### 9.3 Test Content List

```bash
curl -X GET "http://localhost:3001/api/integration/content?status=draft&btOnly=true" \
  -H "X-BT-API-Key: bt_live_xxx"
```

### 9.4 Test Config Sync

```bash
# Ricevi configurazione branding da BT
curl -X POST http://localhost:3001/api/integration/config \
  -H "X-BT-API-Key: bt_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "branding": {
      "primaryColor": "#F59E0B",
      "secondaryColor": "#78716C",
      "accentColor": "#D97706"
    },
    "navigation": {
      "businessTunerUrl": "https://app.businesstuner.io",
      "dashboardUrl": "https://app.businesstuner.io/dashboard"
    }
  }'
```

---

## 10. Security Checklist

1. [ ] API key validata su ogni richiesta integration
2. [ ] Rate limiting sugli endpoint integration (es. 100 req/min)
3. [ ] Logging di tutte le operazioni integration
4. [ ] Validazione input su suggestions (sanitize HTML, length limits)
5. [ ] CORS configurato per accettare solo origini note
6. [ ] Webhook signature verificata per chiamate in uscita verso BT
7. [ ] API key ruotabile senza downtime

---

## 11. Migration Checklist

1. [ ] Crea middleware `btAuth.ts`
2. [ ] Crea service `webhook.service.ts` per notificare BT
3. [ ] Estendi `content.service.ts` con metodi bozze e tracking BT
4. [ ] Crea controller `integration.controller.ts`
5. [ ] Crea router `routes/integration.ts`
6. [ ] Registra router in `server.ts`
7. [ ] Configura variabili ambiente (API key da BT, webhook URL)
8. [ ] Test tutti gli endpoint
9. [ ] Deploy

---

## 12. UI Redesign - Allineamento a Business Tuner

Il frontend del CMS deve essere aggiornato per rispecchiare il design system di Business Tuner, creando un'esperienza coerente tra le due piattaforme.

### 12.1 Design Tokens

Crea un file di design tokens condiviso:

```typescript
// dashboard/design-tokens.ts

export const colors = {
  // Primary - Amber/Gold (identità Business Tuner)
  amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  // Neutral - Stone
  stone: {
    50: '#FAFAF9',
    100: '#F5F5F4',
    200: '#E7E5E4',
    300: '#D6D3D1',
    400: '#A8A29E',
    500: '#78716C',
    600: '#57534E',
    700: '#44403C',
    800: '#292524',
    900: '#1C1917',
  },
  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
};

export const radii = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
};
```

### 12.2 CSS Variables

Aggiorna lo stile globale della dashboard:

```css
/* dashboard/styles/globals.css */

:root {
  /* Colors */
  --color-primary: #F59E0B;
  --color-primary-hover: #D97706;
  --color-primary-light: #FEF3C7;
  
  --color-bg: #FAFAF9;
  --color-surface: #FFFFFF;
  --color-border: #E7E5E4;
  
  --color-text-primary: #1C1917;
  --color-text-secondary: #57534E;
  --color-text-muted: #A8A29E;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  /* Radii */
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  
  /* Fonts */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Base styles */
body {
  font-family: var(--font-sans);
  background-color: var(--color-bg);
  color: var(--color-text-primary);
}

/* Focus states - amber ring come Business Tuner */
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### 12.3 Componenti UI Aggiornati

**Button Component:**

```tsx
// dashboard/components/ui/Button.tsx

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center font-medium
    transition-all duration-200 ease-in-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;
  
  const variants = {
    primary: 'bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800',
    secondary: 'bg-stone-100 text-stone-700 hover:bg-stone-200 active:bg-stone-300 border border-stone-200',
    ghost: 'text-stone-600 hover:bg-stone-100 active:bg-stone-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4\" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
};
```

**Card Component:**

```tsx
// dashboard/components/ui/Card.tsx

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  padding = 'md' 
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  return (
    <div className={`
      bg-white rounded-xl border border-stone-200 
      shadow-sm hover:shadow-md transition-shadow duration-200
      ${paddings[padding]} ${className}
    `}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`pb-4 border-b border-stone-100 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-lg font-semibold text-stone-900">{children}</h3>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children,
  className = '' 
}) => (
  <div className={`pt-4 ${className}`}>{children}</div>
);
```

**Badge Component:**

```tsx
// dashboard/components/ui/Badge.tsx

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-stone-100 text-stone-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };
  
  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 
      rounded-full text-xs font-medium
      ${variants[variant]}
    `}>
      {children}
    </span>
  );
};
```

### 12.4 Dashboard Layout Redesign

Aggiorna il layout principale della dashboard CMS:

```tsx
// dashboard/CMSDashboard.tsx - versione aggiornata

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  Image,
  History,
  Check,
  X,
  RotateCcw,
  Loader2,
  FileText,
  Settings,
  MessageCircle,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { Badge } from './components/ui/Badge';

// Config
const API_URL = import.meta.env.VITE_CMS_API_URL || 'http://localhost:3001';
const SITE_PREVIEW_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:3000';
const BUSINESS_TUNER_URL = import.meta.env.VITE_BUSINESS_TUNER_URL || null;

export const CMSDashboard: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([/* ... */]);
  const [chatOpen, setChatOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  // ... altri state
  
  return (
    <div className="relative h-screen overflow-hidden bg-stone-50">
      {/* Site Preview Iframe */}
      <iframe
        src={previewUrl}
        className="w-full h-full border-0"
        title="Site Preview"
      />
      
      {/* Floating Action Button - Stile Business Tuner */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="
          fixed bottom-6 right-6 w-14 h-14
          bg-amber-600 text-white rounded-full
          shadow-lg hover:shadow-xl hover:bg-amber-700
          transition-all duration-300 ease-out
          flex items-center justify-center
          focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2
          z-50 hover:scale-105
        "
        title="Apri CMS"
      >
        <MessageCircle size={24} />
      </button>
      
      {/* Chat Drawer - Redesigned */}
      <div className={`
        fixed inset-y-0 right-0 w-full md:w-[500px] lg:w-[600px]
        transform transition-transform duration-300 ease-out
        z-40 shadow-2xl
        ${chatOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="h-full flex flex-col bg-white">
          
          {/* Header - Stile Business Tuner */}
          <header className="
            flex items-center justify-between
            px-6 py-4 border-b border-stone-200
            bg-white
          ">
            <div className="flex items-center gap-4">
              {/* Logo/Icon */}
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <FileText className="text-amber-600" size={20} />
              </div>
              <div>
                <h1 className="font-semibold text-stone-900">Gestione Contenuti</h1>
                <p className="text-xs text-stone-500">CMS del tuo sito</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Link a Business Tuner */}
              {BUSINESS_TUNER_URL && (
                <a
                  href={BUSINESS_TUNER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex items-center gap-2 px-3 py-2
                    text-sm text-amber-600 hover:text-amber-700
                    hover:bg-amber-50 rounded-lg transition-colors
                  "
                  title="Apri Business Tuner"
                >
                  <ExternalLink size={16} />
                  <span className="hidden sm:inline">Business Tuner</span>
                </a>
              )}
              
              {/* History */}
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`
                  p-2 rounded-lg transition-colors
                  ${showHistory 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'hover:bg-stone-100 text-stone-500'}
                `}
                title="Cronologia"
              >
                <History size={20} />
              </button>
              
              {/* Close */}
              <button
                onClick={() => setChatOpen(false)}
                className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 transition-colors"
                title="Chiudi"
              >
                <X size={20} />
              </button>
            </div>
          </header>
          
          {/* Business Tuner Connection Banner */}
          {BUSINESS_TUNER_URL && (
            <div className="
              px-4 py-2 bg-amber-50 border-b border-amber-100
              flex items-center justify-between
            ">
              <div className="flex items-center gap-2 text-sm text-amber-700">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>Collegato a Business Tuner</span>
              </div>
              <a
                href={BUSINESS_TUNER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                Vedi insight →
              </a>
            </div>
          )}
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="p-4 border-t border-stone-200 bg-stone-50">
            <div className="flex items-end gap-3">
              {/* Image Upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="
                  p-2.5 rounded-lg border border-stone-200
                  hover:bg-stone-100 text-stone-500
                  transition-colors
                "
                title="Carica immagine"
              >
                <Image size={20} />
              </button>
              
              {/* Text Input */}
              <div className="flex-1">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Scrivi un messaggio..."
                  className="
                    w-full px-4 py-3 rounded-xl
                    border border-stone-200 
                    focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20
                    resize-none text-sm
                    placeholder:text-stone-400
                    transition-all
                  "
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
              </div>
              
              {/* Send Button */}
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                loading={isLoading}
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Message Bubble Component - Redesigned
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`
        max-w-[85%] rounded-2xl px-4 py-3
        ${isUser 
          ? 'bg-amber-600 text-white' 
          : isSystem
            ? 'bg-stone-100 text-stone-600 border border-stone-200'
            : 'bg-white border border-stone-200 text-stone-800 shadow-sm'
        }
      `}>
        {/* Message content */}
        <div className="text-sm whitespace-pre-wrap">
          {message.content}
        </div>
        
        {/* Preview box for content changes */}
        {message.preview && (
          <div className="mt-3 p-3 bg-stone-50 rounded-lg border border-stone-200 text-sm text-stone-600">
            <pre className="whitespace-pre-wrap font-mono text-xs">
              {message.preview}
            </pre>
          </div>
        )}
        
        {/* Action buttons */}
        {message.requiresConfirmation && message.status === 'pending' && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-stone-200">
            <Button size="sm" onClick={() => handleConfirm(message)}>
              <Check size={14} className="mr-1" />
              Conferma
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleReject(message)}>
              <X size={14} className="mr-1" />
              Annulla
            </Button>
          </div>
        )}
        
        {/* Status badge */}
        {message.status === 'confirmed' && (
          <Badge variant="success" className="mt-2">
            <Check size={12} className="mr-1" />
            Confermato
          </Badge>
        )}
      </div>
    </div>
  );
};
```

### 12.5 Suggerimenti da Business Tuner - UI Dedicata

Aggiungi una sezione per visualizzare i suggerimenti ricevuti da Business Tuner:

```tsx
// dashboard/components/BTSuggestions.tsx

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Sparkles, Check, X, ExternalLink } from 'lucide-react';

interface BTSuggestion {
  id: string;
  type: string;
  title: string;
  status: 'draft' | 'published';
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

export const BTSuggestionsPanel: React.FC = () => {
  const [suggestions, setSuggestions] = useState<BTSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchSuggestions();
  }, []);
  
  const fetchSuggestions = async () => {
    try {
      const res = await fetch('/api/content?btOnly=true&status=draft');
      const data = await res.json();
      setSuggestions(data.contents.filter((c: any) => c.btSourceInsightId));
    } catch (e) {
      console.error('Error fetching BT suggestions:', e);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="p-4 text-stone-500">Caricamento...</div>;
  }
  
  if (suggestions.length === 0) {
    return null; // Nascondi se non ci sono suggerimenti
  }
  
  return (
    <div className="p-4 border-b border-stone-200">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="text-amber-500" size={18} />
        <h3 className="font-medium text-stone-800">Suggerimenti da Business Tuner</h3>
        <Badge variant="warning">{suggestions.length}</Badge>
      </div>
      
      <div className="space-y-2">
        {suggestions.slice(0, 3).map((suggestion) => (
          <Card key={suggestion.id} padding="sm" className="hover:border-amber-300 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant={
                    suggestion.priority === 'high' ? 'error' :
                    suggestion.priority === 'medium' ? 'warning' : 'default'
                  }>
                    {suggestion.priority}
                  </Badge>
                  <span className="text-sm font-medium text-stone-800 truncate">
                    {suggestion.title}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                  {suggestion.reasoning}
                </p>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" title="Pubblica">
                  <Check size={14} />
                </Button>
                <Button size="sm" variant="ghost" title="Elimina">
                  <X size={14} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {suggestions.length > 3 && (
        <button className="mt-2 text-sm text-amber-600 hover:text-amber-700 font-medium">
          Vedi tutti ({suggestions.length}) →
        </button>
      )}
    </div>
  );
};
```

---

## 13. Cross-Platform Navigation

### 13.1 Environment Variables per Navigation

```bash
# .env - aggiunte per navigazione

# URL di Business Tuner (per link di ritorno)
BUSINESS_TUNER_URL=https://app.businesstuner.io

# Redirect URL dopo azioni
BUSINESS_TUNER_DASHBOARD_URL=https://app.businesstuner.io/dashboard
BUSINESS_TUNER_INSIGHTS_URL=https://app.businesstuner.io/dashboard/cms/suggestions
```

### 13.2 Endpoint per ricevere configurazione da Business Tuner

```typescript
// routes/integration.ts - aggiungi endpoint

// POST /api/integration/config
// Riceve configurazione da Business Tuner (branding, URLs)

router.post('/config', btApiAuth, integrationController.updateConfig);
```

```typescript
// controllers/integration.controller.ts

interface UpdateConfigRequest {
  branding?: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logoUrl?: string;
  };
  navigation?: {
    businessTunerUrl: string;
    dashboardUrl: string;
    insightsUrl: string;
  };
}

async updateConfig(req: Request, res: Response) {
  const { branding, navigation } = req.body as UpdateConfigRequest;
  
  // Salva configurazione in un file JSON o database
  const configPath = path.join(process.env.CONTENT_PATH!, '_bt_config.json');
  
  const currentConfig = await fs.readFile(configPath, 'utf-8')
    .then(JSON.parse)
    .catch(() => ({}));
  
  const newConfig = {
    ...currentConfig,
    ...(branding && { branding }),
    ...(navigation && { navigation }),
    updatedAt: new Date().toISOString(),
  };
  
  await fs.writeFile(configPath, JSON.stringify(newConfig, null, 2));
  
  res.json({ 
    success: true, 
    message: 'Configuration updated',
    config: newConfig 
  });
}

// GET /api/integration/config
// Restituisce la configurazione corrente

async getConfig(req: Request, res: Response) {
  const configPath = path.join(process.env.CONTENT_PATH!, '_bt_config.json');
  
  try {
    const config = await fs.readFile(configPath, 'utf-8').then(JSON.parse);
    res.json(config);
  } catch {
    res.json({
      branding: null,
      navigation: null,
    });
  }
}
```

### 13.3 Hook per configurazione dinamica nel frontend

```typescript
// dashboard/hooks/useBTConfig.ts

import { useEffect, useState } from 'react';

interface BTConfig {
  branding?: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logoUrl?: string;
  };
  navigation?: {
    businessTunerUrl: string;
    dashboardUrl: string;
    insightsUrl: string;
  };
}

export function useBTConfig() {
  const [config, setConfig] = useState<BTConfig | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/integration/config')
      .then(res => res.json())
      .then(setConfig)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  
  return { config, loading };
}
```

```tsx
// dashboard/CMSDashboard.tsx - uso del config

import { useBTConfig } from './hooks/useBTConfig';

export const CMSDashboard: React.FC = () => {
  const { config } = useBTConfig();
  
  // URL dinamico da config o fallback a env
  const businessTunerUrl = config?.navigation?.businessTunerUrl 
    || import.meta.env.VITE_BUSINESS_TUNER_URL;
  
  // Applica colori dinamici se presenti
  useEffect(() => {
    if (config?.branding) {
      document.documentElement.style.setProperty(
        '--color-primary', 
        config.branding.primaryColor
      );
      document.documentElement.style.setProperty(
        '--color-primary-hover', 
        config.branding.accentColor
      );
    }
  }, [config?.branding]);
  
  // ... resto del componente
};
```

### 13.4 Deep Links per azioni specifiche

```typescript
// utils/navigation.ts

export function buildBTLink(path: string, params?: Record<string, string>) {
  const baseUrl = getBTBaseUrl();
  if (!baseUrl) return null;
  
  const url = new URL(path, baseUrl);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  return url.toString();
}

export function buildBTInsightLink(insightId: string) {
  return buildBTLink('/dashboard/cms/suggestions', { highlight: insightId });
}

export function buildBTAnalyticsLink() {
  return buildBTLink('/dashboard/brand-monitor', { tab: 'website' });
}
```

---

## 14. Testing Cross-Platform

### 14.1 Test Navigation Links

```bash
# Verifica che il CMS mostri il link a Business Tuner
curl http://localhost:3001/api/integration/config

# Aggiorna config da Business Tuner
curl -X POST http://localhost:3001/api/integration/config \
  -H "X-BT-API-Key: bt_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "navigation": {
      "businessTunerUrl": "https://app.businesstuner.io",
      "dashboardUrl": "https://app.businesstuner.io/dashboard",
      "insightsUrl": "https://app.businesstuner.io/dashboard/cms/suggestions"
    }
  }'
```

### 14.2 Test Branding Sync

```bash
# Invia branding da Business Tuner
curl -X POST http://localhost:3001/api/integration/config \
  -H "X-BT-API-Key: bt_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "branding": {
      "primaryColor": "#F59E0B",
      "secondaryColor": "#78716C",
      "accentColor": "#D97706"
    }
  }'
```

---

## Note Implementative

1. **Nessuna integrazione Google**: Analytics e Search Console sono gestiti interamente da Business Tuner. Il CMS si limita a gestire contenuti e notificare pubblicazioni.

2. **Slug collision**: Prima di creare una bozza, verifica che lo slug non esista già. In caso, aggiungi un suffisso numerico.

3. **Preview URL**: Il formato dell'URL di preview dipende dalla struttura del sito. Potrebbe servire configurazione per sito.

4. **Rate limiting**: Considera di aggiungere rate limiting specifico per Business Tuner (es. max 100 suggestions/giorno).

5. **Webhook opzionale**: In futuro, invece di polling da Business Tuner, il CMS potrebbe notificare attivamente quando un contenuto viene pubblicato. Per ora il polling è sufficiente.
