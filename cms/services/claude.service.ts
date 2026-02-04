import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { contentService, ContentType } from './content.service.js';
import { fileService } from './file.service.js';
import { gitService } from './git.service.js';
import fs from 'fs/promises';

// Carica .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const SYSTEM_PROMPT = `Sei l'assistente CMS per il sito web di Chiarli, storica cantina di Lambrusco.

## IL TUO RUOLO
Aiuti il cliente a gestire i CONTENUTI DINAMICI del sito web attraverso una conversazione naturale.

## STILE DI COMUNICAZIONE
- NON usare EMOJI nei messaggi
- Linguaggio professionale ma cordiale
- Risposte concise e chiare

## COSA PUOI FARE - CONTENUTI DINAMICI

### VINI (wines)
✅ PUOI:
- Aggiungere nuovi vini
- Modificare tutti i campi: nome, descrizione, denominazione, prezzo, gradazione, note di degustazione, abbinamenti
- Aggiungere/modificare schede tecniche complete
- Caricare/cambiare immagini dei vini
- Riordinare i vini nella lista
- Eliminare vini
- Disattivare/attivare vini (isActive)

**CREAZIONE VINI DA PDF**: Quando l'utente carica un PDF con una scheda tecnica:
1. Mostra i dati estratti in modo chiaro
2. Aspetta istruzioni esplicite prima di creare il vino
3. Mostra preview e chiedi conferma

### TENUTE (tenute)
✅ PUOI:
- Aggiungere nuove tenute
- Modificare nome, descrizione, storia, statistiche (ettari, altitudine, esposizione, terreno)
- Cambiare immagini
- Eliminare tenute

### ESPERIENZE (experiences)
✅ PUOI:
- Aggiungere nuove esperienze
- Modificare titolo, descrizione, prezzo, durata, disponibilità
- Cambiare immagini
- Eliminare esperienze

### NEWS/BLOG (news)
✅ PUOI:
- Creare nuovi articoli
- Modificare titolo, sottotitolo, contenuto, immagini
- Gestire categorie e tag
- Pubblicare/depubblicare articoli
- Eliminare articoli

### PAGINE CONTENUTO (pages/home, pages/storia, pages/metodo, pages/sostenibilita)
✅ PUOI:
- Modificare titoli, sottotitoli, descrizioni
- Modificare testi dei paragrafi
- Modificare citazioni e testi introduttivi

**HOMEPAGE (pages/home)**: La homepage ha queste sezioni modificabili:
- hero: titleLine1, titleLine2, subtitle (es: "Dal 1860, ridefiniamo l'identità del Lambrusco...")
- winesSection: label, titleLine1, titleLine2, ctaText
- tenuteSection: label, ctaText
- experiencesSection: label, titleLine1, titleLine2, titleLine3, description, quote, ctaPrimary, ctaSecondary

**PAGINA STORIA (pages/storia)**: La pagina storia ha questi campi modificabili:
- storia.foundedYear: anno di fondazione (es: "1860")

**PAGINA METODO E SOSTENIBILITA**: Al momento i testi di queste pagine non sono modificabili dal CMS. Se il cliente chiede di modificare testi in queste pagine, rispondi: "I testi delle pagine Metodo e Sostenibilità non sono ancora gestibili dal CMS. Posso aiutarti con la homepage, la pagina storia, i vini, le tenute, le esperienze o le news."

## SOSTITUZIONE TESTO CON CONTESTO

IMPORTANTE: Il messaggio puo includere informazioni sulla pagina che l'utente sta visualizzando:
- "[L'utente sta visualizzando la pagina: home]" = cerca PRIMA in pages/home
- "[L'utente sta visualizzando la pagina: storia]" = cerca PRIMA in pages/storia
- Contesto selezione: sezione, tipo contenuto, pagina

**REGOLA FONDAMENTALE**: Se l'utente sta visualizzando la HOME e chiede di modificare un testo, cerca SEMPRE PRIMA nel contenuto di pages/home (hero.subtitle, hero.titleLine1, ecc). Solo se NON trovi il testo nella home, cerca altrove.

Quando ricevi un messaggio con contesto di pagina:
1. CERCA PRIMA nella pagina indicata (es: se "home" -> cerca in pages/home)
2. USA i dati di quella pagina per la modifica
3. NON cercare in altre pagine se il testo esiste nella pagina corrente

Quando il cliente chiede di sostituire un testo SENZA contesto:
1. CERCA il testo in tutti i contenuti
2. Se trovi una sola occorrenza, proponi direttamente la modifica
3. Se trovi multiple occorrenze, chiedi quale modificare

## COSA NON PUOI FARE - RIFIUTA SEMPRE

❌ NON PUOI MODIFICARE:
- Header (logo, menu di navigazione)
- Footer (contatti, social, copyright, link)
- Layout e struttura delle pagine
- Colori, font, stile del sito
- Posizione degli elementi
- Impostazioni tecniche del sito

Se il cliente chiede di modificare header, footer, layout, colori o struttura, rispondi:
"Non posso modificare la struttura del sito (header, footer, layout, colori). Posso aiutarti a gestire i contenuti: vini, tenute, esperienze, news e testi delle pagine. Cosa vorresti modificare?"

## WORKFLOW CON PREVIEW

PRIMA di implementare QUALSIASI modifica:
1. Mostra una PREVIEW dettagliata della modifica
2. Spiega cosa cambierà esattamente
3. Aspetta la conferma esplicita del cliente
4. SOLO dopo conferma, esegui la modifica

## FORMATO RISPOSTA

Quando devi eseguire un'operazione, rispondi in questo formato JSON:

{
  "message": "Messaggio per il cliente che spiega cosa stai per fare",
  "preview": "Descrizione dettagliata della modifica",
  "action": {
    "type": "read|update|create|delete",
    "contentType": "wines|tenute|experiences|news|pages/storia",
    "itemId": null | number,
    "data": { ... }
  },
  "requiresConfirmation": true
}

Se NON devi eseguire operazioni:

{
  "message": "La tua risposta al cliente",
  "preview": null,
  "action": null,
  "requiresConfirmation": false
}

## ESEMPI

Cliente: "Aggiungi un nuovo vino Lambrusco Grasparossa"
{
  "message": "Perfetto! Sto per creare un nuovo vino 'Lambrusco Grasparossa'.",
  "preview": "NUOVO VINO:\n- Nome: Lambrusco Grasparossa\n- Stato: Bozza (non pubblicato)",
  "action": {
    "type": "create",
    "contentType": "wines",
    "itemId": null,
    "data": {
      "name": "Lambrusco Grasparossa",
      "description": "",
      "denomination": "Lambrusco Grasparossa di Castelvetro DOC",
      "isActive": false
    }
  },
  "requiresConfirmation": true
}

Cliente: "Cambia il footer"
{
  "message": "Non posso modificare la struttura del sito (header, footer, layout, colori). Posso aiutarti a gestire i contenuti: vini, tenute, esperienze, news e testi delle pagine. Cosa vorresti modificare?",
  "preview": null,
  "action": null,
  "requiresConfirmation": false
}

## CONTESTO ATTUALE
Ti fornirò il contenuto attuale del sito per aiutarti.
`;

// Tool definitions per Claude API
const TOOLS: Anthropic.Tool[] = [
  {
    name: 'read_file',
    description:
      'Legge il contenuto di un file del progetto. Usa questo strumento per capire come funzionano i componenti esistenti prima di crearne di nuovi. Esempio: leggi WineDetailPage.tsx prima di creare una nuova pagina vino.',
    input_schema: {
      type: 'object',
      properties: {
        file_path: {
          type: 'string',
          description:
            'Path relativo del file dalla root del progetto. Esempio: "components/WineDetailPage.tsx"',
        },
      },
      required: ['file_path'],
    },
  },
  {
    name: 'write_file',
    description:
      'Crea o sovrascrive un file del progetto. Usa questo solo dopo aver letto un componente simile esistente. Il nuovo codice DEVE seguire lo stesso stile, colori e animazioni del codice esistente.',
    input_schema: {
      type: 'object',
      properties: {
        file_path: {
          type: 'string',
          description:
            'Path relativo del file dalla root del progetto. Esempio: "components/NewWinePage.tsx"',
        },
        content: {
          type: 'string',
          description: 'Contenuto completo del file da scrivere',
        },
      },
      required: ['file_path', 'content'],
    },
  },
  {
    name: 'list_files',
    description:
      'Lista i file in una directory del progetto. Utile per esplorare la struttura e capire quali componenti esistono.',
    input_schema: {
      type: 'object',
      properties: {
        directory: {
          type: 'string',
          description: 'Path relativo della directory. Usa "." per la root o "components" per i componenti',
        },
      },
      required: ['directory'],
    },
  },
];

interface CMSAction {
  type: 'read' | 'update' | 'create' | 'delete';
  contentType: ContentType;
  itemId: number | null;
  data: any;
}

interface CMSResponse {
  message: string;
  preview?: string | null;
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
  async processMessage(userMessage: string, imageBase64?: string | null): Promise<CMSResponse> {
    // Carica contesto corrente
    const context = await this.loadCurrentContext();

    // Prepara il contenuto del messaggio utente
    // Se c'è un'immagine, usa formato array con image + text
    // Altrimenti usa solo text come stringa
    let messageContent: any;

    if (imageBase64) {
      // Determina il media type dall'header base64 o usa default
      const mediaType = 'image/png'; // Default, può essere migliorato rilevando il tipo

      messageContent = [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: mediaType,
            data: imageBase64,
          },
        },
        {
          type: 'text',
          text: userMessage + '\n\n(Analizza lo screenshot allegato e identifica quale parte del sito vuole modificare l\'utente. Usa questa informazione visiva per capire esattamente quale contenuto modificare.)',
        },
      ];
    } else {
      messageContent = userMessage;
    }

    // Aggiungi messaggio utente alla storia
    this.conversationHistory.push({
      role: 'user',
      content: messageContent,
    });

    // Loop per gestire tool use
    let finalResponse: CMSResponse | null = null;
    let continueLoop = true;

    while (continueLoop) {
      // Chiama Claude con tools
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system:
          SYSTEM_PROMPT +
          '\n\n## CONTENUTO ATTUALE DEL SITO\n```json\n' +
          JSON.stringify(context, null, 2) +
          '\n```',
        messages: this.conversationHistory,
        tools: TOOLS,
      });

      // Aggiungi risposta alla storia
      this.conversationHistory.push({
        role: 'assistant',
        content: response.content,
      });

      // Controlla se ci sono tool uses
      const toolUses = response.content.filter((block) => block.type === 'tool_use');

      if (toolUses.length > 0) {
        // Esegui i tool
        const toolResults: Anthropic.MessageParam = {
          role: 'user',
          content: [],
        };

        for (const toolUse of toolUses) {
          if (toolUse.type !== 'tool_use') continue;

          let result: any;

          switch (toolUse.name) {
            case 'read_file':
              result = await fileService.readFile((toolUse.input as any).file_path);
              break;
            case 'write_file':
              result = await fileService.writeFile((toolUse.input as any).file_path, (toolUse.input as any).content);
              break;
            case 'list_files':
              result = await fileService.listFiles((toolUse.input as any).directory);
              break;
            default:
              result = { success: false, error: 'Tool non riconosciuto' };
          }

          (toolResults.content as any[]).push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: JSON.stringify(result),
          });
        }

        // Aggiungi tool results alla storia
        this.conversationHistory.push(toolResults);
      } else {
        // Nessun tool use, estrai la risposta finale
        const textBlocks = response.content.filter((block) => block.type === 'text');
        const assistantMessage = textBlocks.map((block: any) => block.text).join('\n');

        // Parsa la risposta JSON
        try {
          const jsonMatch = assistantMessage.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            finalResponse = JSON.parse(jsonMatch[0]) as CMSResponse;
          } else {
            finalResponse = {
              message: assistantMessage,
              preview: null,
              action: null,
              requiresConfirmation: false,
            };
          }
        } catch (e) {
          finalResponse = {
            message: assistantMessage,
            preview: null,
            action: null,
            requiresConfirmation: false,
          };
        }

        continueLoop = false;
      }
    }

    return (
      finalResponse || {
        message: 'Errore nel processare la richiesta',
        preview: null,
        action: null,
        requiresConfirmation: false,
      }
    );
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
            // Git commit sarà fatto dal bottone "Pubblica"
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
            // Git commit sarà fatto dal bottone "Pubblica"
            return { success: true, data: updated };
          }

        case 'create':
          const created = await contentService.addItem(action.contentType, action.data, 'cliente');
          // Git commit sarà fatto dal bottone "Pubblica"
          return { success: true, data: created };

        case 'delete':
          if (action.itemId !== null) {
            const deleted = await contentService.removeItem(action.contentType, action.itemId, 'cliente');
            // Git commit sarà fatto dal bottone "Pubblica"
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
   * Analizza un PDF di scheda tecnica vino e estrae le informazioni
   */
  async parsePdfWineSheet(pdfBuffer: Buffer): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const base64Pdf = pdfBuffer.toString('base64');

      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: base64Pdf,
                },
              },
              {
                type: 'text',
                text: `Analizza questa scheda tecnica di un vino ed estrai TUTTE le informazioni in formato JSON strutturato.

Devi estrarre:
- name: nome del vino
- denomination: denominazione completa (es: "Modena Rosè Spumante Brut DOC Metodo Classico")
- family: famiglia/categoria (es: "Metodo Classico", "Premium", ecc.)
- vitigno: descrizione del vitigno utilizzato
- territorio: descrizione del territorio e terroir
- vinificazione: descrizione del processo di vinificazione
- caratteristiche: oggetto con { aspetto, profumo, gusto }
- pairings: array di abbinamenti consigliati
- alcohol: gradazione alcolica (solo numero, es: 12)
- acidita: acidità in g/l (solo numero)
- dosaggio: dosaggio in g/l (solo numero)
- formats: array di formati disponibili (es: ["0.75L", "1.5L"])
- description: una descrizione sintetica del vino (1-2 frasi)
- tags: array di tag appropriati (es: ["Rosé", "Brut", "Metodo Classico"])

IMPORTANTE: Estrai TUTTE le informazioni presenti nel PDF. Se un campo non è presente, usa null.

Rispondi SOLO con un oggetto JSON valido, senza testo aggiuntivo.`,
              },
            ],
          },
        ],
      });

      // Estrai il testo dalla risposta
      const textBlocks = response.content.filter((block) => block.type === 'text');
      const assistantMessage = textBlocks.map((block: any) => block.text).join('\n');

      // Parsa il JSON
      const jsonMatch = assistantMessage.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return { success: false, error: 'Impossibile estrarre dati strutturati dal PDF' };
      }

      const extractedData = JSON.parse(jsonMatch[0]);

      return { success: true, data: extractedData };
    } catch (error: any) {
      console.error('Errore parsing PDF:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Estrazione immagine da PDF disabilitata - il cliente caricherà le immagini manualmente
   */
  async extractBottleImageFromPdf(pdfBuffer: Buffer, wineSlug: string): Promise<{ success: boolean; imagePath?: string; error?: string }> {
    return {
      success: false,
      error: 'Estrazione automatica immagini da PDF non disponibile. Caricare l\'immagine della bottiglia manualmente.',
    };
  }

  /**
   * Carica il contesto corrente - contenuti dinamici
   */
  private async loadCurrentContext(): Promise<any> {
    const [wines, tenute, experiences, news, homeContent, storiaContent] = await Promise.all([
      contentService.read('wines').catch(() => null),
      contentService.read('tenute').catch(() => null),
      contentService.read('experiences').catch(() => null),
      contentService.read('news').catch(() => null),
      contentService.read('pages/home').catch(() => null),
      contentService.read('pages/storia').catch(() => null),
    ]);

    return {
      wines,
      tenute,
      experiences,
      news,
      pages: {
        home: homeContent,
        storia: storiaContent,
      },
    };
  }
}

export const claudeService = new ClaudeService();
