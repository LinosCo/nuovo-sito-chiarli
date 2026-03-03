import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { btAuth } from './btAuth.js';

function normalizeSignature(signature: string): string {
  const trimmed = signature.trim();
  if (trimmed.toLowerCase().startsWith('sha256=')) {
    return trimmed.slice(7);
  }
  return trimmed;
}

function readSignatureHeader(req: Request): string | null {
  const signatureHeader = req.headers['x-bt-signature'];

  if (typeof signatureHeader === 'string' && signatureHeader.trim()) {
    return normalizeSignature(signatureHeader);
  }

  if (Array.isArray(signatureHeader) && signatureHeader[0]?.trim()) {
    return normalizeSignature(signatureHeader[0]);
  }

  return null;
}

export const btAiTipsAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authMode = String(process.env.BT_AI_TIPS_AUTH_MODE || 'bearer').trim().toLowerCase();

  if (authMode !== 'hmac') {
    btAuth(req, res, next);
    return;
  }

  const secret = process.env.BT_AI_TIPS_SHARED_SECRET;
  if (!secret) {
    res.status(500).json({
      error: 'Configuration Error',
      message: 'BT_AI_TIPS_SHARED_SECRET not configured',
    });
    return;
  }

  const signature = readSignatureHeader(req);
  if (!signature) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing x-bt-signature header',
    });
    return;
  }

  const rawBody = typeof (req as any).rawBody === 'string'
    ? (req as any).rawBody
    : JSON.stringify(req.body || {});

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (providedBuffer.length !== expectedBuffer.length) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid signature',
    });
    return;
  }

  if (!crypto.timingSafeEqual(providedBuffer, expectedBuffer)) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid signature',
    });
    return;
  }

  next();
};

