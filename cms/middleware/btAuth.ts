import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * Estrae la API key BT dalla request.
 * Priorita': X-BT-API-Key, poi Authorization: Bearer.
 */
export function getBTApiKeyFromRequest(req: Request): string | null {
  const headerKey = req.headers['x-bt-api-key'];

  if (typeof headerKey === 'string' && headerKey.trim()) {
    return headerKey.trim();
  }

  if (Array.isArray(headerKey) && headerKey[0]?.trim()) {
    return headerKey[0].trim();
  }

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    return token || null;
  }

  return null;
}

/**
 * Confronto timing-safe tra candidate ed expected API key.
 */
export function isValidBTApiKey(candidate: string | null, expected: string | undefined): boolean {
  if (!candidate || !expected) {
    return false;
  }

  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);

  if (candidateBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(candidateBuffer, expectedBuffer);
}

/**
 * Middleware per autenticare richieste da Business Tuner
 * Supporta sia X-BT-API-Key sia Authorization Bearer.
 */
export const btAuth = (req: Request, res: Response, next: NextFunction): void => {
  const token = getBTApiKeyFromRequest(req);
  const expectedToken = process.env.BUSINESS_TUNER_API_KEY;

  if (!expectedToken) {
    console.error('BUSINESS_TUNER_API_KEY non configurata');
    res.status(500).json({
      error: 'Configuration Error',
      message: 'Server not properly configured'
    });
    return;
  }

  const isValid = isValidBTApiKey(token, expectedToken);

  if (!isValid) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing API key'
    });
    return;
  }

  // Autenticazione riuscita
  next();
};
