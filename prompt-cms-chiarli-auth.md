# Prompt per CMS Chiarli (nuovo-sito-chiarli)

## Implementazione Protezione Accesso Dashboard CMS

### Contesto del progetto

Il CMS Chiarli è un sistema di gestione contenuti basato su chat AI (Claude) che permette di modificare i contenuti del sito web tramite conversazione naturale. 

L'architettura attuale include:
- Server Express (`cms/server.ts`) con endpoint chat e integrazione Business Tuner
- Middleware `btAuth` per proteggere gli endpoint di integrazione BT
- Dashboard React (`cms/dashboard/`) per l'interfaccia utente
- Deploy separati: backend su un dominio, dashboard su un altro (es. `chiarlicmsdashboard.vercel.app`)

**Problema da risolvere**: La dashboard CMS è attualmente accessibile pubblicamente. Chiunque conosca l'URL può chattare con l'assistente e modificare i contenuti del sito.

**Soluzione**: Implementare validazione JWT tramite callback a Business Tuner per verificare l'identità dell'utente prima di permettere l'accesso.

---

## Obiettivo

Implementare un sistema di autenticazione che:
1. Riceve token JWT da Business Tuner quando l'utente apre la dashboard
2. Valida il token chiamando l'endpoint di Business Tuner
3. Crea una sessione locale per l'utente autenticato
4. Protegge tutti gli endpoint di chat e modifica contenuti
5. Mostra UI appropriata per utenti non autenticati

---

## Flusso di autenticazione

```
┌──────────────────┐     ┌─────────────────────┐     ┌──────────────────┐
│  Business Tuner  │     │   Dashboard CMS     │     │   CMS Backend    │
└────────┬─────────┘     └──────────┬──────────┘     └────────┬─────────┘
         │                          │                          │
         │ 1. User clicks           │                          │
         │    "Apri Dashboard CMS"  │                          │
         │                          │                          │
         │ 2. Generate JWT token    │                          │
         │ 3. Redirect with token   │                          │
         │─────────────────────────>│                          │
         │                          │                          │
         │                          │ 4. Extract token from URL│
         │                          │                          │
         │                          │ 5. Call BT validate      │
         │                          │─────────────────────────>│
         │                          │                          │
         │<─────────────────────────│ 6. Forward to BT API     │
         │                          │                          │
         │ 7. Validate JWT          │                          │
         │ 8. Return user info      │                          │
         │─────────────────────────>│                          │
         │                          │                          │
         │                          │ 9. Create session        │
         │                          │ 10. Remove token from URL│
         │                          │ 11. Show dashboard       │
         │                          │                          │
```

---

## Specifiche tecniche

### 1. Middleware di autenticazione sessione

Crea `cms/middleware/sessionAuth.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// In-memory session store (per produzione usa Redis)
interface Session {
  userId: string;
  userEmail: string;
  projectId: string;
  organizationId: string;
  permissions: string;
  createdAt: number;
  expiresAt: number;
}

const sessions = new Map<string, Session>();

// Cleanup expired sessions every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(token);
    }
  }
}, 5 * 60 * 1000);

/**
 * Genera un token di sessione sicuro
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Crea una nuova sessione dopo validazione BT
 */
export function createSession(userData: {
  userId: string;
  userEmail: string;
  projectId: string;
  organizationId: string;
  permissions: string;
}): string {
  const token = generateSessionToken();
  const now = Date.now();
  
  sessions.set(token, {
    ...userData,
    createdAt: now,
    expiresAt: now + (24 * 60 * 60 * 1000) // 24 ore
  });
  
  return token;
}

/**
 * Recupera sessione da token
 */
export function getSession(token: string): Session | null {
  const session = sessions.get(token);
  
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  
  return session;
}

/**
 * Elimina sessione (logout)
 */
export function destroySession(token: string): void {
  sessions.delete(token);
}

/**
 * Middleware per proteggere endpoint che richiedono autenticazione
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  // Cerca token in header Authorization o cookie
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.cms_session;
  
  let token: string | null = null;
  
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (cookieToken) {
    token = cookieToken;
  }
  
  if (!token) {
    res.status(401).json({
      error: 'Authentication required',
      code: 'NO_SESSION',
      message: 'Please authenticate via Business Tuner'
    });
    return;
  }
  
  const session = getSession(token);
  
  if (!session) {
    res.status(401).json({
      error: 'Session expired',
      code: 'SESSION_EXPIRED',
      message: 'Your session has expired. Please re-authenticate via Business Tuner'
    });
    return;
  }
  
  // Attach session to request for use in handlers
  (req as any).session = session;
  (req as any).sessionToken = token;
  
  next();
}

/**
 * Middleware opzionale - non blocca ma attacca sessione se presente
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.cms_session;
  
  let token: string | null = null;
  
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (cookieToken) {
    token = cookieToken;
  }
  
  if (token) {
    const session = getSession(token);
    if (session) {
      (req as any).session = session;
      (req as any).sessionToken = token;
    }
  }
  
  next();
}
```

### 2. Servizio di validazione con Business Tuner

Crea `cms/services/btAuth.service.ts`:

```typescript
import fetch from 'node-fetch';

interface BTValidationResult {
  valid: boolean;
  user?: {
    id: string;
    email: string;
    permissions: string;
  };
  project?: {
    id: string;
  };
  organization?: {
    id: string;
  };
  error?: string;
}

/**
 * Valida un token JWT chiamando l'API di Business Tuner
 */
export async function validateBTToken(token: string): Promise<BTValidationResult> {
  const btUrl = process.env.BUSINESS_TUNER_URL || 'https://app.businesstuner.io';
  const btApiKey = process.env.BUSINESS_TUNER_API_KEY;
  const connectionId = process.env.BUSINESS_TUNER_CONNECTION_ID;
  
  if (!btApiKey) {
    console.error('BUSINESS_TUNER_API_KEY not configured');
    return { valid: false, error: 'Server configuration error' };
  }
  
  if (!connectionId) {
    console.error('BUSINESS_TUNER_CONNECTION_ID not configured');
    return { valid: false, error: 'Server configuration error' };
  }
  
  try {
    const response = await fetch(`${btUrl}/api/cms/validate-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${btApiKey}`
      },
      body: JSON.stringify({
        token,
        connectionId
      })
    });
    
    const data = await response.json() as BTValidationResult;
    
    if (!response.ok) {
      console.error('BT validation failed:', data);
      return { 
        valid: false, 
        error: data.error || 'Validation failed' 
      };
    }
    
    return data;
    
  } catch (error: any) {
    console.error('Error calling BT validation:', error.message);
    return { 
      valid: false, 
      error: 'Unable to contact Business Tuner' 
    };
  }
}
```

### 3. Endpoint di autenticazione

Aggiungi al `cms/server.ts`:

```typescript
import cookieParser from 'cookie-parser';
import { 
  requireAuth, 
  optionalAuth, 
  createSession, 
  destroySession, 
  getSession 
} from './middleware/sessionAuth.js';
import { validateBTToken } from './services/btAuth.service.js';

// Aggiungi cookie parser
app.use(cookieParser());

// ============================================
// ROUTES - AUTHENTICATION
// ============================================

/**
 * POST /api/auth/validate
 * Valida token JWT da Business Tuner e crea sessione locale
 */
app.post('/api/auth/validate', async (req, res) => {
  try {
    const { bt_token } = req.body;
    
    if (!bt_token) {
      return res.status(400).json({
        error: 'Missing token',
        code: 'MISSING_TOKEN'
      });
    }
    
    // Valida con Business Tuner
    const validation = await validateBTToken(bt_token);
    
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
```

### 4. Proteggere gli endpoint esistenti

Modifica `cms/server.ts` per proteggere gli endpoint sensibili:

```typescript
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

    const result = await claudeService.executeAction(action);

    if (result.success && process.env.GIT_AUTO_COMMIT === 'true') {
      // Include user info in commit
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
// ROUTES - CONTENT (READ = public, WRITE = protected)
// ============================================

/**
 * GET /api/content/:type
 * Legge un tipo di contenuto (pubblico per ora, potresti proteggere)
 */
app.get('/api/content/:type', async (req, res) => {
  // ... existing code ...
});

// ============================================
// ROUTES - UPLOAD (PROTECTED)
// ============================================

/**
 * POST /api/upload/:category
 * Upload immagini
 * RICHIEDE AUTENTICAZIONE
 */
app.post('/api/upload/:category', requireAuth, upload.single('image'), async (req, res) => {
  // ... existing code with session logging ...
});

/**
 * POST /api/upload/pdf
 * Upload PDF
 * RICHIEDE AUTENTICAZIONE
 */
// Nota: questo endpoint ha già express.raw(), aggiungi requireAuth dopo
```

### 5. Aggiornamento Dashboard React

#### 5.1 Auth Context

Crea `cms/dashboard/src/contexts/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  permissions: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  async function initializeAuth() {
    setIsLoading(true);
    setError(null);

    try {
      // Check for BT token in URL (first access from Business Tuner)
      const params = new URLSearchParams(window.location.search);
      const btToken = params.get('bt_token');
      
      if (btToken) {
        // Validate token with backend
        const response = await fetch('/api/auth/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bt_token: btToken }),
          credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          setUser(data.user);
          
          // Store session token for API calls
          localStorage.setItem('cms_session', data.sessionToken);
          
          // Remove token from URL (security)
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('bt_token');
          newUrl.searchParams.delete('bt_connection');
          window.history.replaceState({}, '', newUrl.toString());
        } else {
          setError(data.error || 'Authentication failed');
        }
      } else {
        // Check existing session
        const response = await fetch('/api/auth/session', {
          credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.authenticated) {
          setUser(data.user);
        }
      }
    } catch (err: any) {
      console.error('Auth initialization error:', err);
      setError('Unable to connect to server');
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('cms_session');
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

#### 5.2 Componente Login/Access Denied

Crea `cms/dashboard/src/components/AccessDenied.tsx`:

```typescript
import React from 'react';
import { Shield, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react';

interface AccessDeniedProps {
  error?: string | null;
  isLoading?: boolean;
}

export function AccessDenied({ error, isLoading }: AccessDeniedProps) {
  const btUrl = import.meta.env.VITE_BUSINESS_TUNER_URL || 'https://app.businesstuner.io';
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <RefreshCw className="w-12 h-12 text-amber-600 mx-auto mb-4 animate-spin" />
          <h1 className="text-xl font-semibold text-stone-900 mb-2">
            Verifica accesso in corso...
          </h1>
          <p className="text-stone-500">
            Connessione a Business Tuner
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">
            Accesso Richiesto
          </h1>
          <p className="text-stone-500">
            Per accedere al CMS devi autenticarti tramite Business Tuner.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Errore di autenticazione</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}
        
        <a
          href={`${btUrl}/dashboard/cms`}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          Accedi da Business Tuner
          <ExternalLink className="w-4 h-4" />
        </a>
        
        <div className="mt-6 pt-6 border-t border-stone-200">
          <p className="text-xs text-stone-400 text-center">
            Il CMS Chiarli è integrato con Business Tuner per garantire 
            la sicurezza dei tuoi contenuti. Solo gli utenti autorizzati 
            possono accedere.
          </p>
        </div>
      </div>
    </div>
  );
}
```

#### 5.3 Wrapper App principale

Modifica `cms/dashboard/src/App.tsx`:

```typescript
import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AccessDenied } from './components/AccessDenied';
import { CMSDashboard } from './CMSDashboard';

function AppContent() {
  const { isAuthenticated, isLoading, error, user, logout } = useAuth();
  
  if (isLoading) {
    return <AccessDenied isLoading={true} />;
  }
  
  if (!isAuthenticated) {
    return <AccessDenied error={error} />;
  }
  
  return <CMSDashboard user={user} onLogout={logout} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
```

#### 5.4 Aggiorna API calls per includere autenticazione

Modifica i fetch esistenti per includere credenziali:

```typescript
// Esempio: in CMSDashboard.tsx o hooks personalizzati

async function sendMessage(message: string, image?: string) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      // Cookie viene inviato automaticamente con credentials: 'include'
    },
    credentials: 'include',
    body: JSON.stringify({ message, image })
  });
  
  if (response.status === 401) {
    // Session expired, redirect to login
    window.location.reload();
    return null;
  }
  
  return response.json();
}
```

### 6. Variabili ambiente

Aggiungi a `cms/.env.example`:

```env
# Business Tuner Integration
BUSINESS_TUNER_URL=https://app.businesstuner.io
BUSINESS_TUNER_API_KEY=bt_live_xxxxx
BUSINESS_TUNER_CONNECTION_ID=conn_xxxxx
BUSINESS_TUNER_WEBHOOK_SECRET=whsec_xxxxx

# Session
SESSION_SECRET=your-session-secret-for-cookies
NODE_ENV=development
```

Per la dashboard (`cms/dashboard/.env`):

```env
VITE_API_URL=http://localhost:3001
VITE_BUSINESS_TUNER_URL=https://app.businesstuner.io
```

### 7. Dipendenze da installare

Backend:
```bash
cd cms
npm install cookie-parser @types/cookie-parser node-fetch@2 @types/node-fetch
```

Dashboard:
```bash
cd cms/dashboard
npm install lucide-react
```

### 8. CORS Configuration

Aggiorna la configurazione CORS in `cms/server.ts`:

```typescript
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3002',
    'https://chiarlicmsdashboard.vercel.app',
    /\.vercel\.app$/,
  ],
  credentials: true, // IMPORTANTE per cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 9. Aggiornamento endpoint Integration (già protetti da btAuth)

Gli endpoint `/api/integration/*` sono già protetti dal middleware `btAuth` che verifica l'API key di Business Tuner. Non serve modificarli, ma assicurati che continuino a funzionare:

```typescript
// Questi restano invariati - usano btAuth, non sessionAuth
app.get('/api/integration/status', btAuth, (req, res) => { ... });
app.post('/api/integration/suggestions', btAuth, (req, res) => { ... });
app.get('/api/integration/content', btAuth, (req, res) => { ... });
```

---

## Riepilogo endpoint

| Endpoint | Metodo | Auth | Descrizione |
|----------|--------|------|-------------|
| `/api/auth/validate` | POST | Public | Valida token BT e crea sessione |
| `/api/auth/session` | GET | Optional | Verifica sessione corrente |
| `/api/auth/logout` | POST | Optional | Termina sessione |
| `/api/chat` | POST | **Required** | Chat con assistente AI |
| `/api/chat/confirm` | POST | **Required** | Esegue azione confermata |
| `/api/chat/reset` | POST | **Required** | Reset conversazione |
| `/api/upload/*` | POST | **Required** | Upload files |
| `/api/content/:type` | GET | Public | Legge contenuti (read-only) |
| `/api/integration/*` | * | btAuth | Comunicazione con BT |

---

## Test checklist

- [ ] Accesso diretto a dashboard senza token mostra "Access Denied"
- [ ] Accesso con token valido da BT crea sessione
- [ ] Token viene rimosso da URL dopo validazione
- [ ] Cookie di sessione viene impostato correttamente
- [ ] Richieste chat senza sessione ritornano 401
- [ ] Richieste chat con sessione funzionano
- [ ] Sessione scade dopo 24 ore
- [ ] Logout elimina sessione e cookie
- [ ] Endpoint integration continuano a funzionare con btAuth
- [ ] Audit log mostra email utente per ogni azione

---

## Note di sicurezza

1. **Cookie httpOnly**: Il cookie di sessione non è accessibile via JavaScript
2. **Secure cookie**: In produzione, il cookie richiede HTTPS
3. **SameSite**: Protegge da CSRF attacks
4. **Token one-time**: Il token JWT viene usato una sola volta per creare la sessione
5. **Session isolation**: Ogni utente ha una sessione separata
6. **Audit trail**: Tutte le azioni loggano l'email dell'utente

---

## Considerazioni per produzione

1. **Redis per sessioni**: Sostituisci la Map in-memory con Redis per scalabilità
2. **Rate limiting**: Aggiungi rate limit su `/api/auth/validate`
3. **Monitoring**: Configura alerting per tentativi di accesso falliti
4. **Backup sessioni**: In caso di restart, le sessioni in-memory vengono perse (Redis risolve)
