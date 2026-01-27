import { Request, Response } from 'express';
import { contentService } from '../services/content.service.js';
import { btWebhookService } from '../services/bt-webhook.service.js';

/**
 * Interface per un suggerimento BT
 */
interface BTSuggestion {
  id: string;
  title: string;
  content: string;
  targetPage: string | null;
  type: string;
  contentType: string;
  priority: 'low' | 'medium' | 'high';
  reasoning: string;
  changes: Record<string, any>;
  status: 'pending' | 'applied' | 'rejected';
  receivedAt: Date;
  appliedAt: Date | null;
  appliedBy: string | null;
}

// In-memory storage per suggerimenti (in produzione usare database)
const suggestionsStore = new Map<string, BTSuggestion>();

/**
 * Controller per l'integrazione con Business Tuner
 * Gestisce lo scambio bidirezionale di dati e suggerimenti
 */
export class IntegrationController {
  /**
   * GET /api/integration/status
   * Verifica lo stato dell'integrazione
   */
  async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = {
        connected: true,
        version: '1.0.0',
        capabilities: [
          'content_management',
          'suggestions',
          'webhooks',
          'analytics_export'
        ],
        lastSync: new Date().toISOString(),
        cmsUrl: process.env.CMS_URL || 'http://localhost:3001',
        dashboardUrl: process.env.DASHBOARD_URL || 'http://localhost:3002'
      };

      res.json(status);
    } catch (error: any) {
      console.error('Errore status integration:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }

  /**
   * POST /api/integration/suggestions
   * Riceve suggerimenti da Business Tuner e li salva per l'applicazione
   */
  async receiveSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const { suggestionId, id, title, content, targetPage, type, contentType, changes, priority, reasoning } = req.body;

      const finalId = suggestionId || id;

      if (!finalId || !type) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Missing required fields: suggestionId (or id), type'
        });
        return;
      }

      // Salva il suggerimento nello store
      const suggestion: BTSuggestion = {
        id: finalId,
        title: title || `Suggerimento ${type}`,
        content: content || reasoning || '',
        targetPage: targetPage || null,
        type,
        contentType: contentType || 'general',
        changes: changes || {},
        priority: priority || 'medium',
        reasoning: reasoning || '',
        status: 'pending',
        receivedAt: new Date(),
        appliedAt: null,
        appliedBy: null
      };

      suggestionsStore.set(finalId, suggestion);

      console.log(`[BT] Nuovo suggerimento ricevuto: ${suggestion.title} (${finalId})`);

      res.json({
        success: true,
        suggestionId: finalId,
        status: 'received',
        message: 'Suggerimento ricevuto e in attesa di revisione'
      });
    } catch (error: any) {
      console.error('Errore receiving suggestions:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }

  /**
   * GET /api/suggestions (per utenti autenticati)
   * Lista tutti i suggerimenti per la dashboard
   */
  async listSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const suggestions = Array.from(suggestionsStore.values())
        .sort((a, b) => b.receivedAt.getTime() - a.receivedAt.getTime());

      const pending = suggestions.filter(s => s.status === 'pending');
      const applied = suggestions.filter(s => s.status === 'applied');
      const rejected = suggestions.filter(s => s.status === 'rejected');

      res.json({
        suggestions,
        total: suggestions.length,
        pending: pending.length,
        applied: applied.length,
        rejected: rejected.length
      });
    } catch (error: any) {
      console.error('Errore listing suggestions:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }

  /**
   * GET /api/suggestions/:id (per utenti autenticati)
   * Dettaglio singolo suggerimento
   */
  async getSuggestion(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const suggestion = suggestionsStore.get(id);

      if (!suggestion) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Suggerimento non trovato'
        });
        return;
      }

      res.json(suggestion);
    } catch (error: any) {
      console.error('Errore getting suggestion:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }

  /**
   * POST /api/suggestions/:id/apply (per utenti autenticati)
   * Marca un suggerimento come applicato e notifica BT
   */
  async applySuggestionByUser(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const session = (req as any).session;
      const suggestion = suggestionsStore.get(id);

      if (!suggestion) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Suggerimento non trovato'
        });
        return;
      }

      if (suggestion.status !== 'pending') {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Suggerimento già processato'
        });
        return;
      }

      // Aggiorna stato
      suggestion.status = 'applied';
      suggestion.appliedAt = new Date();
      suggestion.appliedBy = session?.userEmail || 'unknown';

      console.log(`[BT] Suggerimento applicato: ${suggestion.title} by ${suggestion.appliedBy}`);

      // Notifica Business Tuner
      try {
        await btWebhookService.notifySuggestionApplied(suggestion.id, suggestion.changes);
      } catch (webhookError) {
        console.error('Errore notifica BT (non bloccante):', webhookError);
      }

      res.json({
        success: true,
        suggestion,
        message: 'Suggerimento applicato con successo'
      });
    } catch (error: any) {
      console.error('Errore applying suggestion:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }

  /**
   * POST /api/suggestions/:id/reject (per utenti autenticati)
   * Rifiuta un suggerimento
   */
  async rejectSuggestion(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const session = (req as any).session;
      const suggestion = suggestionsStore.get(id);

      if (!suggestion) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Suggerimento non trovato'
        });
        return;
      }

      if (suggestion.status !== 'pending') {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Suggerimento già processato'
        });
        return;
      }

      suggestion.status = 'rejected';

      console.log(`[BT] Suggerimento rifiutato: ${suggestion.title} by ${session?.userEmail || 'unknown'}`);

      res.json({
        success: true,
        message: 'Suggerimento rifiutato'
      });
    } catch (error: any) {
      console.error('Errore rejecting suggestion:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }

  /**
   * GET /api/integration/content
   * Esporta tutti i contenuti del sito per Business Tuner
   */
  async getContent(req: Request, res: Response): Promise<void> {
    try {
      const { type, format = 'json' } = req.query;

      // Se è specificato un tipo, ritorna solo quello
      if (type && typeof type === 'string') {
        const data = await contentService.read(type as any);
        res.json({
          type,
          data,
          exportedAt: new Date().toISOString()
        });
        return;
      }

      // Altrimenti ritorna tutto
      const allContent = await contentService.listAll();

      if (format === 'structured') {
        // Formato strutturato per Business Tuner
        const structured: {
          wines: any[];
          tenute: any[];
          experiences: any[];
          news: any[];
          pages: Record<string, any>;
          settings: Record<string, any>;
          exportedAt: string;
        } = {
          wines: [],
          tenute: [],
          experiences: [],
          news: [],
          pages: {},
          settings: {},
          exportedAt: new Date().toISOString()
        };

        for (const { type, data } of allContent) {
          if (type === 'wines') structured.wines = data.wines || [];
          else if (type === 'tenute') structured.tenute = data.tenute || [];
          else if (type === 'experiences') structured.experiences = data.experiences || [];
          else if (type === 'news') structured.news = data.news || [];
          else if (type.startsWith('pages/')) {
            const pageName = type.replace('pages/', '');
            structured.pages[pageName] = data;
          } else if (type === 'settings') {
            structured.settings = data;
          }
        }

        res.json(structured);
      } else {
        // Formato raw
        res.json({
          content: allContent,
          exportedAt: new Date().toISOString()
        });
      }
    } catch (error: any) {
      console.error('Errore getting content:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }

  /**
   * POST /api/integration/config
   * Aggiorna la configurazione dell'integrazione
   */
  async updateConfig(req: Request, res: Response): Promise<void> {
    try {
      const { webhookEnabled, notificationPreferences, syncInterval } = req.body;

      // In una implementazione reale, salverei queste configurazioni
      const config = {
        webhookEnabled: webhookEnabled !== undefined ? webhookEnabled : true,
        notificationPreferences: notificationPreferences || {
          contentUpdates: true,
          errors: true,
          suggestions: true
        },
        syncInterval: syncInterval || 300, // 5 minuti default
        updatedAt: new Date().toISOString()
      };

      console.log('Configurazione aggiornata:', config);

      // Test webhook se abilitato
      if (config.webhookEnabled) {
        await btWebhookService.notify('config.updated', {
          changes: ['webhookEnabled', 'notificationPreferences', 'syncInterval'],
          config
        });
      }

      res.json({
        success: true,
        config,
        message: 'Configurazione aggiornata con successo'
      });
    } catch (error: any) {
      console.error('Errore updating config:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }

  /**
   * POST /api/integration/suggestions/:id/apply
   * Applica un suggerimento ricevuto da Business Tuner
   */
  async applySuggestion(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { contentType, changes } = req.body;

      if (!contentType || !changes) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Missing required fields: contentType, changes'
        });
        return;
      }

      // Applica le modifiche
      // In una implementazione reale, avremmo logica più complessa per validare e applicare
      console.log(`Applicando suggerimento ${id} a ${contentType}:`, changes);

      // Notifica Business Tuner
      const suggestionId = Array.isArray(id) ? id[0] : id;
      await btWebhookService.notifySuggestionApplied(suggestionId, changes);

      res.json({
        success: true,
        suggestionId: id,
        message: 'Suggerimento applicato con successo'
      });
    } catch (error: any) {
      console.error('Errore applying suggestion:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }

  /**
   * POST /api/integration/test-webhook
   * Testa la connessione webhook con Business Tuner
   */
  async testWebhook(req: Request, res: Response): Promise<void> {
    try {
      const success = await btWebhookService.notify('test.connection', {
        message: 'Test webhook dal CMS Chiarli',
        timestamp: new Date().toISOString()
      });

      if (success) {
        res.json({
          success: true,
          message: 'Webhook inviato con successo'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Errore invio webhook - controlla i log'
        });
      }
    } catch (error: any) {
      console.error('Errore test webhook:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }
}

export const integrationController = new IntegrationController();
