# BT AI Tips Contract - CMS Implementation

Questa guida descrive l'implementazione lato CMS del contratto BT AI Tips (`contractVersion=1.0.0`).

## Endpoint disponibili

- `POST /api/integrations/bt/ai-tips`
  - crea job asincrono (`202 + jobId`)
  - supporta idempotenza con header `X-Idempotency-Key`
- `GET /api/integrations/bt/ai-tips/:jobId`
  - legge stato job (`queued|processing|completed|failed|blocked`)
- `POST /api/integrations/bt/ai-tips/:jobId/apply`
  - applica patch solo per job `completed` e `executionMode=propose_patch`
- `GET /api/integrations/bt/ai-tips/metrics`
  - metriche runtime (`totalJobs`, `blockedJobs`, `avgLatencyMs`, ecc.)

## Sicurezza e compatibilita BT

- Auth BT standard:
  - `X-BT-API-Key: <BUSINESS_TUNER_API_KEY>`
  - oppure `Authorization: Bearer <BUSINESS_TUNER_API_KEY>`
- Auth alternativa per `POST /api/integrations/bt/ai-tips`:
  - `BT_AI_TIPS_AUTH_MODE=hmac`
  - header `x-bt-signature` (HMAC-SHA256 su raw body)

## Env vars

```env
BT_AI_TIPS_ENABLED=true
BT_AI_TIPS_AUTH_MODE=bearer
BT_AI_TIPS_SHARED_SECRET=
BT_AI_TIPS_RATE_LIMIT_PER_MINUTE=30
BT_AI_TIPS_MAX_PAYLOAD_KB=128
BT_AI_TIPS_ALLOWED_SITE_IDS=site_123
```

## cURL base

```bash
curl -X POST http://localhost:3001/api/integrations/bt/ai-tips \
  -H "Content-Type: application/json" \
  -H "X-BT-API-Key: bt_live_xxx" \
  -H "X-Idempotency-Key: tips-001" \
  -d '{
    "contractVersion": "1.0.0",
    "siteId": "site_123",
    "locale": "it-IT",
    "interventionType": "CONTENT_QUALITY",
    "taskType": "IMPROVE_READABILITY",
    "priority": "MEDIUM",
    "targetScope": {
      "scopeType": "PAGE",
      "siteId": "site_123",
      "pageId": "home",
      "url": "https://example.com/"
    },
    "inputData": {
      "contentType": "pages/home",
      "fieldPath": "hero.titleLine1",
      "currentContent": "INCONFONDIBILE, CHIARLI"
    },
    "acceptanceRules": {},
    "executionMode": "dry_run",
    "metadata": {
      "tipId": "tip_001",
      "source": "bt-ai-tips"
    }
  }'
```

## Esempi per interventionType

### 1) CONTENT_QUALITY

```bash
curl -X POST http://localhost:3001/api/integrations/bt/ai-tips \
  -H "Content-Type: application/json" \
  -H "X-BT-API-Key: bt_live_xxx" \
  -d '{"siteId":"site_123","locale":"it-IT","interventionType":"CONTENT_QUALITY","taskType":"REWRITE_BLOCK","priority":"MEDIUM","targetScope":{"scopeType":"PAGE","siteId":"site_123","pageId":"home"},"inputData":{"contentType":"pages/home","fieldPath":"experiencesSection.description","currentContent":"Testo lungo..."},"acceptanceRules":{},"executionMode":"dry_run","metadata":{"tipId":"tip_cq_001"}}'
```

### 2) SEO_ONPAGE

```bash
curl -X POST http://localhost:3001/api/integrations/bt/ai-tips \
  -H "Content-Type: application/json" \
  -H "X-BT-API-Key: bt_live_xxx" \
  -d '{"siteId":"site_123","locale":"it-IT","interventionType":"SEO_ONPAGE","taskType":"OPTIMIZE_META_DESCRIPTION","priority":"HIGH","targetScope":{"scopeType":"PAGE","siteId":"site_123","pageId":"storia"},"inputData":{"contentType":"pages/storia","fieldPath":"storia.description","currentContent":"Descrizione attuale"},"acceptanceRules":{"maxMetaDescriptionLength":155},"executionMode":"dry_run","metadata":{"tipId":"tip_seo_001"}}'
```

### 3) CONVERSION_CRO

```bash
curl -X POST http://localhost:3001/api/integrations/bt/ai-tips \
  -H "Content-Type: application/json" \
  -H "X-BT-API-Key: bt_live_xxx" \
  -d '{"siteId":"site_123","locale":"it-IT","interventionType":"CONVERSION_CRO","taskType":"REWRITE_CTA","priority":"HIGH","targetScope":{"scopeType":"PAGE","siteId":"site_123","pageId":"home"},"inputData":{"contentType":"pages/home","fieldPath":"experiencesSection.ctaPrimary","currentContent":"Prenota una visita"},"acceptanceRules":{},"executionMode":"dry_run","metadata":{"tipId":"tip_cro_001"}}'
```

### 4) ACCESSIBILITY_COMPLIANCE

```bash
curl -X POST http://localhost:3001/api/integrations/bt/ai-tips \
  -H "Content-Type: application/json" \
  -H "X-BT-API-Key: bt_live_xxx" \
  -d '{"siteId":"site_123","locale":"it-IT","interventionType":"ACCESSIBILITY_COMPLIANCE","taskType":"SIMPLIFY_LANGUAGE","priority":"MEDIUM","targetScope":{"scopeType":"PAGE","siteId":"site_123","pageId":"storia"},"inputData":{"contentType":"pages/storia","fieldPath":"storia.description","currentContent":"Testo tecnico complesso"},"acceptanceRules":{},"executionMode":"dry_run","metadata":{"tipId":"tip_acc_001"}}'
```

### 5) BRAND_VOICE

```bash
curl -X POST http://localhost:3001/api/integrations/bt/ai-tips \
  -H "Content-Type: application/json" \
  -H "X-BT-API-Key: bt_live_xxx" \
  -d '{"siteId":"site_123","locale":"it-IT","interventionType":"BRAND_VOICE","taskType":"ALIGN_TONE","priority":"MEDIUM","targetScope":{"scopeType":"PAGE","siteId":"site_123","pageId":"home"},"inputData":{"contentType":"pages/home","fieldPath":"winesSection.titleLine1","currentContent":"L arte del vino"},"acceptanceRules":{},"executionMode":"dry_run","metadata":{"tipId":"tip_brand_001"}}'
```

### 6) CONTENT_GOVERNANCE

```bash
curl -X POST http://localhost:3001/api/integrations/bt/ai-tips \
  -H "Content-Type: application/json" \
  -H "X-BT-API-Key: bt_live_xxx" \
  -d '{"siteId":"site_123","locale":"it-IT","interventionType":"CONTENT_GOVERNANCE","taskType":"ENFORCE_LEGAL_DISCLAIMER","priority":"CRITICAL","targetScope":{"scopeType":"SECTION","siteId":"site_123","sectionId":"blog"},"inputData":{"contentType":"news","fieldPath":"content","itemId":1,"currentContent":"Contenuto articolo"},"acceptanceRules":{"forbiddenTerms":["garantito al 100%"]},"executionMode":"propose_patch","metadata":{"tipId":"tip_gov_001"}}'
```

## Verifica job e apply

```bash
# Stato job
curl -H "X-BT-API-Key: bt_live_xxx" \
  http://localhost:3001/api/integrations/bt/ai-tips/job_abc123

# Apply (solo se executionMode=propose_patch e job completed)
curl -X POST http://localhost:3001/api/integrations/bt/ai-tips/job_abc123/apply \
  -H "Content-Type: application/json" \
  -H "X-BT-API-Key: bt_live_xxx" \
  -d '{"appliedBy":"bt-worker"}'
```

