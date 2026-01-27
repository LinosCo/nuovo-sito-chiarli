# Prompt per CMS Chiarli (nuovo-sito-chiarli)

## Implementazione Integrazione Business Tuner - Suggerimenti e SSO

### Contesto del progetto

Il CMS Chiarli è un sistema di gestione contenuti basato su chat AI (Claude) sviluppato da Voler.ai. È integrato con Business Tuner per:
- Autenticazione SSO (l'utente accede da BT senza inserire credenziali)
- Ricezione suggerimenti AI generati da BT
- Applicazione suggerimenti tramite chat conversazionale
- Notifica a BT quando un suggerimento viene applicato

**Architettura:**
- Server Express (`cms/server.ts`) con endpoint chat e integrazione BT
- Dashboard React (`cms/dashboard/`) per l'interfaccia utente
- Deploy separati: backend e dashboard su domini diversi

---

## Obiettivo

Implementare un sistema che:
1. Riceve e valida token JWT da Business Tuner
2. Mostra suggerimenti ricevuti da BT in modo prominente
3. Permette di applicare suggerimenti tramite chat AI
4. Notifica BT quando un suggerimento viene applicato
5. Protegge tutti gli endpoint di modifica

---

## Flusso completo

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
         │                          │ 5. POST /api/auth/validate
         │                          │─────────────────────────>│
         │                          │                          │
         │<─────────────────────────│ 6. Forward to BT API     │
         │                          │                          │
         │ 7. Validate JWT          │                          │
         │ 8. Return user info      │                          │
         │─────────────────────────>│                          │
         │                          │                          │
         │                          │ 9. Create local session  │
         │                          │<─────────────────────────│
         │                          │                          │
         │                          │ 10. Remove token from URL│
         │                          │ 11. Show dashboard       │
         │                          │                          │
```

---

## 1. Backend: Middleware Sessione

File: `cms/middleware/sessionAuth.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

interface Session {
  userId: string;
  userEmail: string;
  projectId: string;
  organizationId: string;
  permissions: string;
  createdAt: number;
  expiresAt: number;
}

// In produzione usare Redis
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

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

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

export function getSession(token: string): Session | null {
  const session = sessions.get(token);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return session;
}

export function destroySession(token: string): void {
  sessions.delete(token);
}

/**
 * Middleware: richiede autenticazione
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
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
      message: 'Accedi tramite Business Tuner'
    });
    return;
  }
  
  const session = getSession(token);
  
  if (!session) {
    res.status(401).json({
      error: 'Session expired',
      code: 'SESSION_EXPIRED',
      message: 'Sessione scaduta. Accedi nuovamente da Business Tuner'
    });
    return;
  }
  
  (req as any).session = session;
  (req as any).sessionToken = token;
  
  next();
}

/**
 * Middleware: auth opzionale (non blocca)
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

---

## 2. Backend: Validazione Token BT

File: `cms/services/btAuth.service.ts`

```typescript
import fetch from 'node-fetch';

interface BTValidationResult {
  valid: boolean;
  user?: {
    id: string;
    email: string;
    permissions: string;
  };
  project?: { id: string };
  organization?: { id: string };
  error?: string;
}

export async function validateBTToken(token: string): Promise<BTValidationResult> {
  const btUrl = process.env.BUSINESS_TUNER_URL || 'https://app.businesstuner.io';
  const btApiKey = process.env.BUSINESS_TUNER_API_KEY;
  const connectionId = process.env.BUSINESS_TUNER_CONNECTION_ID;
  
  if (!btApiKey || !connectionId) {
    console.error('BUSINESS_TUNER_API_KEY or CONNECTION_ID not configured');
    return { valid: false, error: 'Server configuration error' };
  }
  
  try {
    const response = await fetch(`${btUrl}/api/cms/validate-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${btApiKey}`
      },
      body: JSON.stringify({ token, connectionId })
    });

    const data = await response.json() as BTValidationResult;
    return data;
    
  } catch (error: any) {
    console.error('BT validation failed:', error);
    return { valid: false, error: 'Connection to Business Tuner failed' };
  }
}
```

---

## 3. Backend: Endpoint Auth

File: `cms/routes/auth.ts`

```typescript
import { Router } from 'express';
import { validateBTToken } from '../services/btAuth.service';
import { createSession, getSession, destroySession } from '../middleware/sessionAuth';

const router = Router();

/**
 * POST /api/auth/validate
 * Valida token BT e crea sessione locale
 */
router.post('/validate', async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ 
      success: false, 
      error: 'Token required' 
    });
  }
  
  const result = await validateBTToken(token);
  
  if (!result.valid || !result.user) {
    return res.status(401).json({
      success: false,
      error: result.error || 'Invalid token'
    });
  }
  
  // Crea sessione locale
  const sessionToken = createSession({
    userId: result.user.id,
    userEmail: result.user.email,
    projectId: result.project!.id,
    organizationId: result.organization!.id,
    permissions: result.user.permissions
  });
  
  // Set cookie
  res.cookie('cms_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 ore
  });
  
  return res.json({
    success: true,
    user: {
      email: result.user.email,
      permissions: result.user.permissions
    }
  });
});

/**
 * GET /api/auth/session
 * Verifica sessione corrente
 */
router.get('/session', (req, res) => {
  const cookieToken = req.cookies?.cms_session;
  
  if (!cookieToken) {
    return res.json({ authenticated: false });
  }
  
  const session = getSession(cookieToken);
  
  if (!session) {
    res.clearCookie('cms_session');
    return res.json({ authenticated: false });
  }
  
  return res.json({
    authenticated: true,
    user: {
      email: session.userEmail,
      permissions: session.permissions
    }
  });
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  const cookieToken = req.cookies?.cms_session;
  
  if (cookieToken) {
    destroySession(cookieToken);
  }
  
  res.clearCookie('cms_session');
  return res.json({ success: true });
});

export default router;
```

---

## 4. Backend: Gestione Suggerimenti BT

File: `cms/routes/suggestions.ts`

```typescript
import { Router } from 'express';
import { requireAuth } from '../middleware/sessionAuth';
import { btAuth } from '../middleware/btAuth';
import { notifyBTSuggestionApplied } from '../services/btWebhook.service';

const router = Router();

// In-memory storage (in produzione usare database)
interface Suggestion {
  id: string;
  title: string;
  content: string;
  targetPage: string | null;
  type: string;
  status: 'pending' | 'applied' | 'rejected';
  receivedAt: Date;
  appliedAt: Date | null;
  appliedBy: string | null;
}

const suggestions = new Map<string, Suggestion>();

/**
 * POST /api/integration/suggestions
 * Riceve suggerimenti da Business Tuner (protetto da btAuth)
 */
router.post('/integration/suggestions', btAuth, async (req, res) => {
  const { id, title, content, targetPage, type, source } = req.body;
  
  if (!id || !title || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const suggestion: Suggestion = {
    id,
    title,
    content,
    targetPage: targetPage || null,
    type: type || 'UPDATE_CONTENT',
    status: 'pending',
    receivedAt: new Date(),
    appliedAt: null,
    appliedBy: null
  };
  
  suggestions.set(id, suggestion);
  
  console.log(`[BT] Received suggestion: ${title}`);
  
  return res.json({ success: true, suggestionId: id });
});

/**
 * GET /api/suggestions
 * Lista suggerimenti (per dashboard, richiede auth)
 */
router.get('/', requireAuth, (req, res) => {
  const session = (req as any).session;
  
  const list = Array.from(suggestions.values())
    .sort((a, b) => b.receivedAt.getTime() - a.receivedAt.getTime());
  
  return res.json({
    suggestions: list,
    total: list.length,
    pending: list.filter(s => s.status === 'pending').length
  });
});

/**
 * GET /api/suggestions/:id
 * Dettaglio suggerimento
 */
router.get('/:id', requireAuth, (req, res) => {
  const suggestion = suggestions.get(req.params.id);
  
  if (!suggestion) {
    return res.status(404).json({ error: 'Suggestion not found' });
  }
  
  return res.json(suggestion);
});

/**
 * POST /api/suggestions/:id/apply
 * Marca suggerimento come applicato e notifica BT
 */
router.post('/:id/apply', requireAuth, async (req, res) => {
  const session = (req as any).session;
  const suggestion = suggestions.get(req.params.id);
  
  if (!suggestion) {
    return res.status(404).json({ error: 'Suggestion not found' });
  }
  
  if (suggestion.status !== 'pending') {
    return res.status(400).json({ error: 'Suggestion already processed' });
  }
  
  // Aggiorna stato
  suggestion.status = 'applied';
  suggestion.appliedAt = new Date();
  suggestion.appliedBy = session.userEmail;
  
  // Notifica Business Tuner
  try {
    await notifyBTSuggestionApplied(suggestion.id, session.userEmail);
  } catch (error) {
    console.error('Failed to notify BT:', error);
    // Non bloccare anche se la notifica fallisce
  }
  
  return res.json({ success: true, suggestion });
});

/**
 * POST /api/suggestions/:id/reject
 * Rifiuta suggerimento
 */
router.post('/:id/reject', requireAuth, async (req, res) => {
  const session = (req as any).session;
  const suggestion = suggestions.get(req.params.id);
  
  if (!suggestion) {
    return res.status(404).json({ error: 'Suggestion not found' });
  }
  
  suggestion.status = 'rejected';
  
  return res.json({ success: true });
});

export default router;
```

---

## 5. Backend: Webhook verso BT

File: `cms/services/btWebhook.service.ts`

```typescript
import fetch from 'node-fetch';
import crypto from 'crypto';

export async function notifyBTSuggestionApplied(
  suggestionId: string,
  appliedBy: string
): Promise<void> {
  const btUrl = process.env.BUSINESS_TUNER_URL || 'https://app.businesstuner.io';
  const webhookSecret = process.env.BUSINESS_TUNER_WEBHOOK_SECRET;
  const connectionId = process.env.BUSINESS_TUNER_CONNECTION_ID;
  
  if (!webhookSecret || !connectionId) {
    throw new Error('Webhook not configured');
  }
  
  const payload = JSON.stringify({
    suggestionId,
    connectionId,
    appliedBy
  });
  
  // Genera HMAC signature
  const signature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex');
  
  const response = await fetch(`${btUrl}/api/cms/webhooks/suggestion-applied`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-BT-Signature': signature
    },
    body: payload
  });
  
  if (!response.ok) {
    throw new Error(`BT webhook failed: ${response.status}`);
  }
}
```

---

## 6. Backend: Server principale

File: `cms/server.ts` (aggiornamenti)

```typescript
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import suggestionsRoutes from './routes/suggestions';
import chatRoutes from './routes/chat';
import { requireAuth, optionalAuth } from './middleware/sessionAuth';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3002',
    /\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/suggestions', suggestionsRoutes);

// Chat routes (protetti)
app.use('/api/chat', requireAuth, chatRoutes);

// Integration routes (protetti da btAuth, vedi middleware esistente)
// app.use('/api/integration', btAuth, integrationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`CMS Server running on port ${PORT}`);
});
```

---

## 7. Frontend: Auth Context

File: `cms/dashboard/src/contexts/AuthContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  email: string;
  permissions: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Check for BT token in URL
  useEffect(() => {
    const validateToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const btToken = params.get('bt_token');
      
      if (btToken) {
        try {
          const response = await fetch(`${apiUrl}/api/auth/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ token: btToken })
          });
          
          const data = await response.json();
          
          if (data.success) {
            setIsAuthenticated(true);
            setUser(data.user);
            
            // Rimuovi token da URL
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('bt_token');
            newUrl.searchParams.delete('bt_connection');
            window.history.replaceState({}, '', newUrl.toString());
          } else {
            setError(data.error || 'Autenticazione fallita');
          }
        } catch (err) {
          setError('Errore di connessione');
        }
      }
      
      // Check existing session
      await checkSession();
      setIsLoading(false);
    };

    validateToken();
  }, [apiUrl]);

  const checkSession = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/session`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.authenticated) {
        setIsAuthenticated(true);
        setUser(data.user);
      }
    } catch (err) {
      console.error('Session check failed:', err);
    }
  };

  const logout = useCallback(async () => {
    try {
      await fetch(`${apiUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Logout failed:', err);
    }
    
    setIsAuthenticated(false);
    setUser(null);
  }, [apiUrl]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, error, logout }}>
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

---

## 8. Frontend: Access Denied

File: `cms/dashboard/src/components/AccessDenied.tsx`

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
            Il CMS è integrato con Business Tuner per garantire 
            la sicurezza dei tuoi contenuti.
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## 9. Frontend: Banner Suggerimenti BT

File: `cms/dashboard/src/components/BTSuggestionsBanner.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronRight, Check, X } from 'lucide-react';

interface Suggestion {
  id: string;
  title: string;
  content: string;
  targetPage: string | null;
  type: string;
  status: string;
}

interface BTSuggestionsBannerProps {
  onApplySuggestion: (suggestion: Suggestion) => void;
}

export function BTSuggestionsBanner({ onApplySuggestion }: BTSuggestionsBannerProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/suggestions`, {
        credentials: 'include'
      });
      const data = await response.json();
      setSuggestions(data.suggestions.filter((s: Suggestion) => s.status === 'pending'));
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await fetch(`${apiUrl}/api/suggestions/${id}/reject`, {
        method: 'POST',
        credentials: 'include'
      });
      setSuggestions(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Failed to reject suggestion:', error);
    }
  };

  if (isLoading || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-900">
              {suggestions.length} suggeriment{suggestions.length === 1 ? 'o' : 'i'} da Business Tuner
            </h3>
            <p className="text-sm text-amber-700">
              Clicca per vedere e applicare
            </p>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 text-amber-600 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          {suggestions.map(suggestion => (
            <div 
              key={suggestion.id}
              className="bg-white rounded-lg p-4 border border-amber-100"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                  {suggestion.targetPage && (
                    <p className="text-sm text-gray-500 mt-1">
                      Pagina: {suggestion.targetPage}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {suggestion.content.substring(0, 150)}...
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject(suggestion.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Ignora"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onApplySuggestion(suggestion);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg font-medium transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Applica
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 10. Frontend: Integrazione nella Chat

File: `cms/dashboard/src/components/ChatInterface.tsx` (modifiche)

```typescript
// Aggiungi import
import { BTSuggestionsBanner } from './BTSuggestionsBanner';

// Nel componente principale, aggiungi handler per applicare suggerimento
const handleApplySuggestion = async (suggestion: Suggestion) => {
  // Inserisci il contenuto nella chat come messaggio
  const message = `Voglio applicare questo suggerimento da Business Tuner:

**${suggestion.title}**

${suggestion.content}

${suggestion.targetPage ? `Pagina target: ${suggestion.targetPage}` : ''}

Per favore, applica questo contenuto.`;

  // Invia messaggio alla chat
  await sendMessage(message);
  
  // Marca come applicato
  try {
    await fetch(`${apiUrl}/api/suggestions/${suggestion.id}/apply`, {
      method: 'POST',
      credentials: 'include'
    });
  } catch (error) {
    console.error('Failed to mark suggestion as applied:', error);
  }
};

// Nel JSX, aggiungi il banner sopra la chat
return (
  <div className="flex flex-col h-full">
    <BTSuggestionsBanner onApplySuggestion={handleApplySuggestion} />
    
    {/* Chat messages */}
    <div className="flex-1 overflow-y-auto">
      {messages.map((msg, i) => (
        <ChatMessage key={i} message={msg} />
      ))}
    </div>
    
    {/* Input */}
    <ChatInput onSend={sendMessage} />
  </div>
);
```

---

## 11. Variabili ambiente

**Backend (`cms/.env`):**

```env
# Business Tuner Integration
BUSINESS_TUNER_URL=https://app.businesstuner.io
BUSINESS_TUNER_API_KEY=bt_live_xxxxx
BUSINESS_TUNER_CONNECTION_ID=conn_xxxxx
BUSINESS_TUNER_WEBHOOK_SECRET=whsec_xxxxx

# Server
PORT=3001
NODE_ENV=development
```

**Frontend (`cms/dashboard/.env`):**

```env
VITE_API_URL=http://localhost:3001
VITE_BUSINESS_TUNER_URL=https://app.businesstuner.io
```

---

## 12. Dipendenze

**Backend:**
```bash
cd cms
npm install cookie-parser @types/cookie-parser
```

**Frontend:**
```bash
cd cms/dashboard
npm install lucide-react
```

---

## 13. Test checklist

- [ ] Accesso diretto a dashboard senza token mostra "Access Denied"
- [ ] Accesso con token valido da BT crea sessione
- [ ] Token viene rimosso da URL dopo validazione
- [ ] Cookie di sessione viene impostato
- [ ] Richieste chat senza sessione ritornano 401
- [ ] Richieste chat con sessione funzionano
- [ ] Ricezione suggerimenti da BT funziona
- [ ] Banner suggerimenti visibile quando ci sono pending
- [ ] Click "Applica" inserisce contenuto in chat
- [ ] Webhook verso BT funziona quando suggerimento applicato
- [ ] Sessione scade dopo 24 ore
- [ ] Logout funziona

---

## 14. Note di sicurezza

1. **Cookie httpOnly**: Non accessibile via JavaScript
2. **Secure cookie**: Richiede HTTPS in produzione
3. **SameSite**: Protegge da CSRF
4. **Token one-time**: JWT usato solo per creare sessione
5. **HMAC webhook**: Signature per verificare autenticità
6. **Audit trail**: Tutte le azioni loggano email utente
