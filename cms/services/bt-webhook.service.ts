import crypto from 'crypto';

interface WebhookPayload {
  event: string;
  [key: string]: any;
}

/**
 * Servizio per inviare notifiche a Business Tuner via webhook
 * Include firma HMAC-SHA256 per sicurezza
 */
export class BTWebhookService {
  private webhookUrl: string;
  private webhookSecret: string;
  private btBaseUrl: string;
  private connectionId: string;

  constructor() {
    this.webhookUrl = process.env.BUSINESS_TUNER_WEBHOOK_URL || '';
    this.webhookSecret = process.env.BUSINESS_TUNER_WEBHOOK_SECRET || '';
    this.connectionId = process.env.BUSINESS_TUNER_CONNECTION_ID || '';

    const explicitBtUrl = (process.env.BUSINESS_TUNER_URL || '').trim().replace(/\/$/, '');
    if (explicitBtUrl) {
      this.btBaseUrl = explicitBtUrl;
    } else if (this.webhookUrl.includes('/api/webhooks/cms/')) {
      this.btBaseUrl = this.webhookUrl.split('/api/webhooks/cms/')[0];
    } else {
      this.btBaseUrl = '';
    }

    if (!this.webhookUrl) {
      console.warn('BUSINESS_TUNER_WEBHOOK_URL non configurato - i webhook saranno disabilitati');
    }
    if (!this.webhookSecret) {
      console.warn('BUSINESS_TUNER_WEBHOOK_SECRET non configurato - i webhook non avranno firma');
    }
    if (!this.connectionId) {
      console.warn('BUSINESS_TUNER_CONNECTION_ID non configurato - callback suggestion-applied non disponibile');
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
      ...data,
    };

    if (!payload.publishedAt) {
      payload.publishedAt = new Date().toISOString();
    }

    const payloadString = JSON.stringify(payload);
    const signature = this.generateSignature(payloadString);

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-cms-signature': `sha256=${signature}`,
          'x-cms-event': event
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
    if (!this.btBaseUrl) {
      console.warn('BUSINESS_TUNER_URL non configurato - callback suggestion-applied non inviabile');
      return false;
    }
    if (!this.connectionId) {
      console.warn('BUSINESS_TUNER_CONNECTION_ID non configurato - callback suggestion-applied non inviabile');
      return false;
    }

    const payload = {
      suggestionId,
      connectionId: this.connectionId,
      appliedBy: appliedChanges?.appliedBy || 'cms-chatbot',
      contentId: appliedChanges?.contentId || null,
      publishedUrl: appliedChanges?.publishedUrl || appliedChanges?.url || null
    };

    const payloadString = JSON.stringify(payload);
    const signature = this.generateSignature(payloadString);

    try {
      const response = await fetch(`${this.btBaseUrl}/api/cms/webhooks/suggestion-applied`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-bt-signature': signature
        },
        body: payloadString
      });

      if (!response.ok) {
        console.error('Errore callback suggestion-applied:', response.status, await response.text());
        return false;
      }

      return true;
    } catch (error) {
      console.error('Errore callback suggestion-applied:', error);
      return false;
    }
  }
}

// Istanza singleton
export const btWebhookService = new BTWebhookService();
