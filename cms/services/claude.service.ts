import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { contentService, ContentType } from './content.service.js';

// Carica .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const SYSTEM_PROMPT = `Sei l'assistente CMS per il sito web di Chiarli, storica cantina di Lambrusco.

## IL TUO RUOLO
Aiuti il cliente a gestire i contenuti del sito web attraverso una conversazione naturale.
Interpreti le richieste in linguaggio naturale e le trasformi in operazioni sui contenuti.

## REGOLE ASSOLUTE - NON VIOLARLE MAI
1. Puoi SOLO modificare contenuti testuali e immagini dei contenuti
2. NON puoi modificare: layout, colori, font, animazioni, struttura del sito
3. Se il cliente chiede qualcosa fuori scope, rispondi: "Questa modifica richiede l'intervento dello sviluppatore. Posso aiutarti a contattarlo?"

## CONTENUTI CHE PUOI GESTIRE

### VINI (wines)
- Aggiungere nuovi vini
- Modificare nome, descrizione, denominazione, prezzo, tags
- Caricare/cambiare immagini dei vini
- Riordinare i vini
- Disattivare/attivare vini (isActive)

### TENUTE (tenute)
- Modificare descrizione, stats (ettari, altitudine)
- Cambiare immagini
- NON puoi: aggiungere nuove tenute, modificare posizione sulla mappa

### ESPERIENZE (experiences)
- Aggiungere nuove esperienze
- Modificare titolo, descrizione, prezzo, durata
- Eliminare esperienze

### NEWS/BLOG (news)
- Creare nuovi articoli
- Modificare titolo, contenuto, immagine
- Pubblicare/depubblicare articoli
- Eliminare articoli

### TESTI PAGINE (pages/home, pages/storia)
- Modificare titoli, sottotitoli, descrizioni
- Cambiare testi dei pulsanti (CTA)
- NON puoi: cambiare immagini di sfondo delle sezioni

### IMPOSTAZIONI (settings)
- Modificare contatti (indirizzo, telefono, email)
- Aggiungere/modificare link social
- Modificare testo newsletter
- NON puoi: cambiare logo, navigazione principale

## FORMATO RISPOSTA

Quando devi eseguire un'operazione, rispondi SEMPRE in questo formato JSON:

{
  "message": "Messaggio per il cliente che spiega cosa stai per fare",
  "action": {
    "type": "read|update|create|delete",
    "contentType": "wines|tenute|experiences|news|settings|pages/home|pages/storia",
    "itemId": null | number,
    "data": { ... } // i dati da modificare/creare
  },
  "requiresConfirmation": true | false
}

Se NON devi eseguire operazioni (es: rispondere a una domanda):

{
  "message": "La tua risposta al cliente",
  "action": null,
  "requiresConfirmation": false
}

## ESEMPI

Cliente: "Cambia il prezzo del Lambrusco Bio a 15 euro"
{
  "message": "Sto per aggiornare il prezzo del Lambrusco Bio a €15.00. Confermi?",
  "action": {
    "type": "update",
    "contentType": "wines",
    "itemId": 7,
    "data": { "price": 15 }
  },
  "requiresConfirmation": true
}

Cliente: "Aggiungi una news: Evento degustazione il 20 dicembre"
{
  "message": "Sto per creare una nuova news con titolo 'Evento degustazione il 20 dicembre'. Vuoi aggiungere altri dettagli?",
  "action": {
    "type": "create",
    "contentType": "news",
    "itemId": null,
    "data": {
      "title": "Evento degustazione il 20 dicembre",
      "excerpt": "",
      "content": "",
      "image": null,
      "author": "Chiarli",
      "publishedAt": "2024-12-09",
      "tags": ["eventi"],
      "isPublished": false
    }
  },
  "requiresConfirmation": true
}

Cliente: "Cambia il colore del menu in rosso"
{
  "message": "Mi dispiace, non posso modificare i colori del sito. Questa modifica richiede l'intervento dello sviluppatore. Posso aiutarti con altro? Ad esempio posso modificare testi, aggiungere vini, creare news...",
  "action": null,
  "requiresConfirmation": false
}

## CONTESTO ATTUALE
Ti fornirò il contenuto attuale del sito per aiutarti a capire cosa esiste e cosa può essere modificato.
`;

interface CMSAction {
  type: 'read' | 'update' | 'create' | 'delete';
  contentType: ContentType;
  itemId: number | null;
  data: any;
}

interface CMSResponse {
  message: string;
  action: CMSAction | null;
  requiresConfirmation: boolean;
}

export class ClaudeService {
  private client: Anthropic;
  private conversationHistory: Anthropic.Messages.MessageParam[] = [];

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  /**
   * Resetta la conversazione
   */
  resetConversation() {
    this.conversationHistory = [];
  }

  /**
   * Processa un messaggio del cliente
   */
  async processMessage(userMessage: string): Promise<CMSResponse> {
    // Carica contesto corrente
    const context = await this.loadCurrentContext();

    // Aggiungi messaggio utente alla storia
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
    });

    // Chiama Claude
    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: SYSTEM_PROMPT + '\n\n## CONTENUTO ATTUALE DEL SITO\n```json\n' + JSON.stringify(context, null, 2) + '\n```',
      messages: this.conversationHistory,
    });

    // Estrai risposta
    const assistantMessage = response.content[0].type === 'text' ? response.content[0].text : '';

    // Aggiungi risposta alla storia
    this.conversationHistory.push({
      role: 'assistant',
      content: assistantMessage,
    });

    // Parsa la risposta JSON
    try {
      // Cerca il JSON nella risposta
      const jsonMatch = assistantMessage.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as CMSResponse;
      }
    } catch (e) {
      // Se non riesce a parsare, ritorna come messaggio semplice
    }

    return {
      message: assistantMessage,
      action: null,
      requiresConfirmation: false,
    };
  }

  /**
   * Esegue un'azione confermata
   */
  async executeAction(action: CMSAction): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      switch (action.type) {
        case 'read':
          const readData = await contentService.read(action.contentType);
          return { success: true, data: readData };

        case 'update':
          if (action.itemId !== null) {
            // Aggiorna item specifico
            const updated = await contentService.updateItem(
              action.contentType,
              action.itemId,
              action.data,
              'cliente'
            );
            return { success: true, data: updated };
          } else {
            // Aggiorna campi
            const fieldPath = Object.keys(action.data)[0];
            const updated = await contentService.updateFields(
              action.contentType,
              fieldPath,
              action.data[fieldPath],
              'cliente'
            );
            return { success: true, data: updated };
          }

        case 'create':
          const created = await contentService.addItem(action.contentType, action.data, 'cliente');
          return { success: true, data: created };

        case 'delete':
          if (action.itemId !== null) {
            const deleted = await contentService.removeItem(action.contentType, action.itemId, 'cliente');
            return { success: deleted };
          }
          return { success: false, error: 'ID non specificato per eliminazione' };

        default:
          return { success: false, error: 'Azione non supportata' };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Carica il contesto corrente del sito
   */
  private async loadCurrentContext(): Promise<any> {
    const [wines, tenute, experiences, news, settings, homeContent, storiaContent] = await Promise.all([
      contentService.read('wines').catch(() => null),
      contentService.read('tenute').catch(() => null),
      contentService.read('experiences').catch(() => null),
      contentService.read('news').catch(() => null),
      contentService.read('settings').catch(() => null),
      contentService.read('pages/home').catch(() => null),
      contentService.read('pages/storia').catch(() => null),
    ]);

    return {
      wines,
      tenute,
      experiences,
      news,
      settings,
      pages: {
        home: homeContent,
        storia: storiaContent,
      },
    };
  }
}

export const claudeService = new ClaudeService();
