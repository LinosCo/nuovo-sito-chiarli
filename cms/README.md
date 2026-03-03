# CMS Chat Chiarli

Sistema CMS basato su chat per la gestione dei contenuti del sito Chiarli.

## Architettura

```
cms/
├── server.ts              # Server Express principale
├── services/
│   ├── claude.service.ts  # Integrazione Claude API
│   ├── content.service.ts # Gestione file JSON
│   ├── git.service.ts     # Versioning automatico
│   └── upload.service.ts  # Gestione immagini
├── dashboard/
│   ├── CMSDashboard.tsx   # Interfaccia chat React
│   └── index.html         # Entry point dashboard
└── package.json
```

## Setup

### 1. Installazione dipendenze

```bash
cd cms
npm install
```

### 2. Configurazione

Copia `.env.example` in `.env` e configura:

```bash
cp .env.example .env
```

Modifica `.env`:

```env
# API Key Anthropic (obbligatoria)
ANTHROPIC_API_KEY=sk-ant-...

# Server
PORT=3001
NODE_ENV=development

# Paths
CONTENT_PATH=../content
UPLOADS_PATH=../public/uploads
SITE_PATH=..

# Frontend URL (per CORS)
FRONTEND_URL=http://localhost:3000

# Git versioning (opzionale)
GIT_AUTO_COMMIT=true
GIT_AUTHOR_NAME=CMS Bot
GIT_AUTHOR_EMAIL=cms@chiarli.it

# Business Tuner (M2M)
BUSINESS_TUNER_URL=https://businesstuner.voler.ai
BUSINESS_TUNER_API_KEY=bt_live_xxx
BUSINESS_TUNER_WEBHOOK_URL=https://businesstuner.voler.ai/api/webhooks/cms/conn_xxx
BUSINESS_TUNER_WEBHOOK_SECRET=whsec_xxx
BUSINESS_TUNER_CONNECTION_ID=conn_xxx

# URL sito pubblico (usato dai discovery endpoint /pages e /posts)
SITE_PUBLIC_URL=https://www.chiarli.it

# BT AI Tips Contract (opzionale)
BT_AI_TIPS_ENABLED=false
BT_AI_TIPS_AUTH_MODE=bearer
BT_AI_TIPS_SHARED_SECRET=
BT_AI_TIPS_RATE_LIMIT_PER_MINUTE=30
BT_AI_TIPS_MAX_PAYLOAD_KB=128
BT_AI_TIPS_ALLOWED_SITE_IDS=
```

### 3. Avvio

**Solo Backend CMS:**
```bash
npm run dev
```

**Backend + Sito (development):**
```bash
npm run preview
```

**Dashboard CMS (separata):**
```bash
cd dashboard
npx vite
```

## API Endpoints

### Chat

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| POST | `/api/chat` | Invia messaggio all'assistente |
| POST | `/api/chat/confirm` | Conferma un'azione |
| POST | `/api/chat/reset` | Resetta conversazione |

### Contenuti

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/content/:type` | Leggi contenuti (wines, tenute, etc.) |
| PUT | `/api/content/:type/:id` | Aggiorna item |
| POST | `/api/content/:type` | Crea nuovo item |
| DELETE | `/api/content/:type/:id` | Elimina item |

### Upload

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| POST | `/api/upload/:category` | Carica immagine |
| DELETE | `/api/upload` | Elimina immagine |
| GET | `/api/upload/:category` | Lista immagini |

### Storia/Rollback

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/history` | Storia modifiche |
| POST | `/api/history/rollback` | Ripristina versione |

### Business Tuner Compatibility

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/status` | Health check BT con `X-BT-API-Key` |
| POST | `/suggestions` | Ingestion suggerimenti BT (alias compatibile) |
| GET | `/pages` | Discovery pagine |
| GET | `/posts` | Discovery post/news |
| GET | `/categories` | Discovery categorie/tag |
| POST | `/api/integrations/bt/ai-tips` | Crea job AI Tips (`202 + jobId`) |
| GET | `/api/integrations/bt/ai-tips/:jobId` | Stato/risultato job |
| POST | `/api/integrations/bt/ai-tips/:jobId/apply` | Applica patch proposta |
| GET | `/api/integrations/bt/ai-tips/metrics` | Metriche runtime |

Autenticazione BT supportata:
- Header `X-BT-API-Key: <BUSINESS_TUNER_API_KEY>`
- In alternativa, `Authorization: Bearer <BUSINESS_TUNER_API_KEY>`

## Esempio Utilizzo Chat API

```javascript
// Invia messaggio
const response = await fetch('http://localhost:3001/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Aggiungi un nuovo vino chiamato Test' })
});

const data = await response.json();
// {
//   message: "Sto per creare un nuovo vino...",
//   action: { type: "create", contentType: "wines", ... },
//   requiresConfirmation: true
// }

// Conferma azione
if (data.requiresConfirmation) {
  await fetch('http://localhost:3001/api/chat/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: data.action })
  });
}
```

## Contenuti Editabili

### Il cliente può:

- **Vini**: Aggiungere, modificare, eliminare
- **News/Blog**: Creare articoli, pubblicare/depubblicare
- **Esperienze**: Aggiungere nuove esperienze
- **Testi pagine**: Modificare titoli, descrizioni, CTA
- **Contatti**: Aggiornare indirizzo, telefono, email
- **Immagini**: Caricare per vini, news, gallery

### Il cliente NON può:

- Modificare layout, colori, font
- Cambiare struttura pagine
- Modificare componenti React
- Eliminare immagini di sistema (logo, mappe)
- Aggiungere nuove pagine

## Struttura Contenuti

```
content/
├── wines.json        # Catalogo vini
├── tenute.json       # Tenute/vigneti
├── experiences.json  # Esperienze/visite
├── news.json         # Articoli blog
├── settings.json     # Impostazioni sito
├── pages/
│   ├── home.json     # Testi homepage
│   └── storia.json   # Testi pagina storia
└── types.ts          # TypeScript types
```

## Sicurezza

1. **Prompt System**: Claude è istruito a rifiutare richieste fuori scope
2. **Backend Validation**: Whitelist di operazioni permesse
3. **Git Versioning**: Ogni modifica è tracciata e reversibile
4. **Protected Images**: Logo e asset di sistema non eliminabili

## Troubleshooting

### "Errore connessione"
- Verifica che il server CMS sia avviato (`npm run dev`)
- Controlla che ANTHROPIC_API_KEY sia configurata

### "Operazione non permessa"
- Il cliente sta cercando di modificare qualcosa fuori scope
- L'assistente risponderà con alternative permesse

### Rollback modifiche
1. Vai nella sezione "Cronologia" della dashboard
2. Trova la versione desiderata
3. Clicca "Ripristina"
