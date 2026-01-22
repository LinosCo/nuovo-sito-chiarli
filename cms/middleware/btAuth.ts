import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * Middleware per autenticare richieste da Business Tuner
 * Usa timing-safe comparison per prevenire timing attacks
 */
export const btAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or invalid Authorization header'
    });
    return;
  }

  const token = authHeader.substring(7); // Rimuovi 'Bearer '
  const expectedToken = process.env.BUSINESS_TUNER_API_KEY;

  if (!expectedToken) {
    console.error('BUSINESS_TUNER_API_KEY non configurata');
    res.status(500).json({
      error: 'Configuration Error',
      message: 'Server not properly configured'
    });
    return;
  }

  // Timing-safe comparison
  const tokenBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expectedToken);

  // I buffer devono avere la stessa lunghezza per il confronto
  if (tokenBuffer.length !== expectedBuffer.length) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid API key'
    });
    return;
  }

  const isValid = crypto.timingSafeEqual(tokenBuffer, expectedBuffer);

  if (!isValid) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid API key'
    });
    return;
  }

  // Autenticazione riuscita
  next();
};
