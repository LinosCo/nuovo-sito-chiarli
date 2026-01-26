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
  const cookieToken = (req as any).cookies?.cms_session;

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
  const cookieToken = (req as any).cookies?.cms_session;

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
