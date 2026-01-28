# Guida Attivazione CMS Voler.ai

## Prerequisiti

- Codice già deployato su entrambi i progetti Vercel
- Accesso admin a Business Tuner
- Accesso al progetto CMS su Vercel

---

## Step 1: Genera i Secrets

Esegui questi comandi nel terminale per generare i valori necessari:

```bash
# Secret per JWT (usato da Business Tuner)
echo "CMS_JWT_SECRET=$(openssl rand -hex 32)"

# API Key per il CMS (identifica il CMS quando chiama BT)
echo "CMS_API_KEY=$(openssl rand -hex 24)"

# Webhook Secret (per firmare i webhook dal CMS a BT)
echo "CMS_WEBHOOK_SECRET=$(openssl rand -hex 32)"

# Session Secret (per i cookie del CMS)
echo "SESSION_SECRET=$(openssl rand -hex 32)"
```

**Salva questi valori**, ti serviranno nei prossimi step.

---

## Step 2: Variabili Ambiente - Business Tuner

**Vercel → ai-interviewer → Settings → Environment Variables**

| Nome | Valore | Ambienti |
|------|--------|----------|
| `CMS_JWT_SECRET` | `<valore generato step 1>` | Production, Preview |

> Se hai più CMS Voler.ai, usa lo stesso `CMS_JWT_SECRET` per tutti.

---

## Step 3: Variabili Ambiente - CMS (es. nuovo-sito-chiarli)

**Vercel → nuovo-sito-chiarli → Settings → Environment Variables**

### Backend (server Express)

| Nome | Valore | Note |
|------|--------|------|
| `BUSINESS_TUNER_URL` | `https://businesstuner.voler.ai` | URL di BT |
| `BUSINESS_TUNER_API_KEY` | `<CMS_API_KEY generato step 1>` | Identifica questo CMS |
| `BUSINESS_TUNER_CONNECTION_ID` | `<lo otterrai allo step 4>` | ID connessione da BT |
| `BUSINESS_TUNER_WEBHOOK_SECRET` | `<CMS_WEBHOOK_SECRET generato step 1>` | Per firmare webhook |
| `SESSION_SECRET` | `<SESSION_SECRET generato step 1>` | Per cookie sessione |
| `NODE_ENV` | `production` | |

### Frontend (dashboard React)

| Nome | Valore | Note |
|------|--------|------|
| `VITE_API_URL` | `https://cms-api.chiarli.it` | URL del backend CMS |
| `VITE_BUSINESS_TUNER_URL` | `https://businesstuner.voler.ai` | Per link "Torna a BT" |

---

## Step 4: Crea Connessione CMS in Business Tuner

### Opzione A: Via Database (Prisma Studio)

```bash
# Nel progetto ai-interviewer
npx prisma studio
```

Apri la tabella `CMSConnection` e crea un nuovo record:

| Campo | Valore | Esempio |
|-------|--------|---------|
| `id` | Auto-generato o `cuid()` | `clx1abc...` |
| `projectId` | ID del progetto BT del cliente | `clw9xyz...` |
| `name` | Nome descrittivo | `Sito Chiarli` |
| `siteUrl` | URL del sito pubblico | `https://chiarli.it` |
| `cmsApiUrl` | URL API del CMS | `https://cms-api.chiarli.it` |
| `cmsDashboardUrl` | URL dashboard CMS | `https://cms-dashboard.chiarli.it` |
| `apiKey` | `<CMS_API_KEY generato step 1>` | Stesso valore di `BUSINESS_TUNER_API_KEY` |
| `webhookSecret` | `<CMS_WEBHOOK_SECRET generato step 1>` | Stesso valore di `BUSINESS_TUNER_WEBHOOK_SECRET` |
| `status` | `ACTIVE` | |
| `createdBy` | Email admin | `admin@voler.ai` |

**Copia l'`id` generato** → questo è il `BUSINESS_TUNER_CONNECTION_ID` da inserire nelle env vars del CMS (Step 3).

### Opzione B: Via Script

Crea un file temporaneo `scripts/create-cms-connection.ts`:

```typescript
import { prisma } from '../src/lib/prisma';

async function main() {
  const connection = await prisma.cMSConnection.create({
    data: {
      projectId: 'ID_PROGETTO_CLIENTE', // Sostituisci
      name: 'Sito Chiarli',
      siteUrl: 'https://chiarli.it',
      cmsApiUrl: 'https://cms-api.chiarli.it',
      cmsDashboardUrl: 'https://cms-dashboard.chiarli.it',
      apiKey: 'CMS_API_KEY_GENERATO', // Sostituisci
      webhookSecret: 'CMS_WEBHOOK_SECRET_GENERATO', // Sostituisci
      status: 'ACTIVE',
      createdBy: 'admin@voler.ai'
    }
  });
  
  console.log('Connection created!');
  console.log('BUSINESS_TUNER_CONNECTION_ID=' + connection.id);
}

main();
```

```bash
npx ts-node scripts/create-cms-connection.ts
```

---

## Step 5: Aggiorna Variabile Connection ID sul CMS

Ora che hai l'ID della connessione:

**Vercel → nuovo-sito-chiarli → Settings → Environment Variables**

Aggiorna/aggiungi:
| Nome | Valore |
|------|--------|
| `BUSINESS_TUNER_CONNECTION_ID` | `<ID copiato dallo step 4>` |

---

## Step 6: Redeploy

Dopo aver impostato tutte le variabili, fai redeploy di entrambi i progetti:

**Business Tuner:**
```bash
# Se hai modificato env vars, Vercel richiede redeploy
# Vai su Vercel → ai-interviewer → Deployments → Redeploy (ultimo deploy)
```

**CMS:**
```bash
# Vercel → nuovo-sito-chiarli → Deployments → Redeploy
```

---

## Step 7: Test

### 7.1 Test Validazione Token

```bash
# Genera un token di test (esegui nel progetto BT)
# Oppure usa curl per testare l'endpoint

curl -X POST https://businesstuner.voler.ai/api/cms/validate-session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <CMS_API_KEY>" \
  -d '{
    "token": "test_invalid_token",
    "connectionId": "<CONNECTION_ID>"
  }'

# Risposta attesa: { "valid": false, "error": "Invalid token" }
# Questo conferma che l'endpoint funziona e l'API key è corretta
```

### 7.2 Test Flusso Completo

1. Accedi a Business Tuner come utente con piano BUSINESS
2. Vai al progetto che ha la connessione CMS
3. Clicca "Apri Dashboard CMS" (o il pulsante equivalente)
4. Dovresti essere reindirizzato al CMS e autenticato automaticamente

---

## Troubleshooting

### "Invalid API key"
- Verifica che `BUSINESS_TUNER_API_KEY` sul CMS sia identico al campo `apiKey` in CMSConnection

### "Connection mismatch"
- Verifica che `BUSINESS_TUNER_CONNECTION_ID` sul CMS sia l'ID corretto della connessione

### "Token expired"
- Il JWT dura 24h, l'utente deve riaprire da BT

### "CMS connection disabled"
- Verifica che `status` in CMSConnection sia `ACTIVE`

### "User does not have access"
- L'utente deve essere membro del progetto/organizzazione in BT

### "CMS Voler.ai requires BUSINESS plan"
- L'organizzazione deve avere subscription tier BUSINESS o ENTERPRISE

### CORS errors
- Verifica che il backend CMS abbia CORS configurato per accettare richieste dal dominio della dashboard

---

## Riepilogo Variabili

### Business Tuner (ai-interviewer)
```env
CMS_JWT_SECRET=<32 byte hex>
```

### CMS Backend
```env
BUSINESS_TUNER_URL=https://businesstuner.voler.ai
BUSINESS_TUNER_API_KEY=<24 byte hex>
BUSINESS_TUNER_CONNECTION_ID=<cuid from BT database>
BUSINESS_TUNER_WEBHOOK_SECRET=<32 byte hex>
SESSION_SECRET=<32 byte hex>
NODE_ENV=production
```

### CMS Frontend
```env
VITE_API_URL=https://cms-api.cliente.it
VITE_BUSINESS_TUNER_URL=https://businesstuner.voler.ai
```

---

## Checklist Finale

- [ ] `CMS_JWT_SECRET` impostato su BT Vercel
- [ ] Tutte le env vars impostate su CMS Vercel (backend + frontend)
- [ ] Record `CMSConnection` creato nel database BT
- [ ] `BUSINESS_TUNER_CONNECTION_ID` contiene l'ID corretto
- [ ] `apiKey` in DB = `BUSINESS_TUNER_API_KEY` nel CMS
- [ ] `webhookSecret` in DB = `BUSINESS_TUNER_WEBHOOK_SECRET` nel CMS
- [ ] Entrambi i progetti redeployati
- [ ] Test flusso SSO funzionante
