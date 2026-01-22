import crypto from 'crypto';

interface WebhookPayload {
  event: string;
  timestamp: string;
  data: Record<string, any>;
}

/**
 * Servizio per inviare notifiche a Business Tuner via webhook
 * Include firma HMAC-SHA256 per sicurezza
 */
export class BTWebhookService {
  private webhookUrl: string;
  private webhookSecret: string;

  constructor() {
    this.webhookUrl = process.env.BUSINESS_TUNER_WEBHOOK_URL || '';
    this.webhookSecret = process.env.BUSINESS_TUNER_WEBHOOK_SECRET || '';

    if (!this.webhookUrl) {
      console.warn('BUSINESS_TUNER_WEBHOOK_URL non configurato - i webhook saranno disabilitati');
    }
    if (!this.webhookSecret) {
      console.warn('BUSINESS_TUNER_WEBHOOK_SECRET non configurato - i webhook non avranno firma');
    }
  }

  /**
   * Genera firma HMAC-SHA256 per il payload
   */
  private generateSignature(payload: string): string {
    return crypto
      .createHmac('sha256', this.webhookSecret)
      .update(payload)
      .digest('hex');
  }

  /**
   * Invia notifica a Business Tuner
   */
  async notify(event: string, data: Record<string, any>): Promise<boolean> {
    if (!this.webhookUrl) {
      console.log('Webhook disabilitato - evento non inviato:', event);
      throw new Error('Business Tuner non configurato. Aggiungi BUSINESS_TUNER_WEBHOOK_URL al file .env');
    }

    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data
    };

    const payloadString = JSON.stringify(payload);
    const signature = this.generateSignature(payloadString);

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-BT-Signature': signature,
          'X-BT-Timestamp': payload.timestamp
        },
        body: payloadString
      });

      if (!response.ok) {
        console.error('Errore invio webhook:', response.status, await response.text());
        return false;
      }

      console.log('Webhook inviato con successo:', event);
      return true;
    } catch (error) {
      console.error('Errore invio webhook:', error);
      return false;
    }
  }

  /**
   * Notifica aggiornamento contenuto
   */
  async notifyContentUpdate(contentType: string, contentId: string, changes: string[]): Promise<boolean> {
    return this.notify('content.updated', {
      contentType,
      contentId,
      changes,
      updatedBy: 'cms-chatbot'
    });
  }

  /**
   * Notifica dati analytics pronti
   */
  async notifyAnalyticsReady(period: string, metrics: Record<string, any>): Promise<boolean> {
    return this.notify('analytics.ready', {
      period,
      metrics,
      generatedAt: new Date().toISOString()
    });
  }

  /**
   * Notifica errore nel CMS
   */
  async notifyError(errorType: string, errorMessage: string, context?: Record<string, any>): Promise<boolean> {
    return this.notify('cms.error', {
      errorType,
      errorMessage,
      context: context || {},
      occurredAt: new Date().toISOString()
    });
  }

  /**
   * Notifica suggerimento applicato
   */
  async notifySuggestionApplied(suggestionId: string, appliedChanges: Record<string, any>): Promise<boolean> {
    return this.notify('suggestion.applied', {
      suggestionId,
      appliedChanges,
      appliedAt: new Date().toISOString()
    });
  }
}

// Istanza singleton
export const btWebhookService = new BTWebhookService();
