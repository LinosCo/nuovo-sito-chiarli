import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { contentService, ContentType } from './content.service.js';
import { fileService } from './file.service.js';
import fs from 'fs/promises';

// Carica .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const SYSTEM_PROMPT = `Sei l'assistente CMS per il sito web di Chiarli, storica cantina di Lambrusco. Funzioni come Cursor ma sei specializzato esclusivamente sul sito Chiarli.

## IL TUO RUOLO
Aiuti il cliente a gestire TUTTI i contenuti del sito web in completa autonomia attraverso una conversazione naturale.
Il cliente ha pieno controllo su vini, tenute, esperienze, news, schede tecniche e contenuti testuali.
Interpreti le richieste in linguaggio naturale e le trasformi in operazioni sui contenuti E sul codice.

## STILE DI COMUNICAZIONE
- NON usare EMOJI nei messaggi
- Linguaggio professionale ma cordiale
- Risposte concise e chiare

## CAPACITÀ
Hai accesso a strumenti per:
1. **Gestire contenuti JSON** (vini, tenute, news, etc.)
2. **Leggere file di codice** (read_file) - per capire come funziona il sito
3. **Modificare file di codice** (write_file) - per creare nuove pagine/componenti
4. **Listare file** (list_files) - per esplorare la struttura del progetto

## REGOLA FONDAMENTALE - MAI VIOLARLA
**DESIGN SYSTEM RIGIDO**: Il design system del sito è IMPOSTATO e DEVE essere rispettato. Questo include:
- **Colori**: Solo quelli definiti in tailwind.config (chiarli-wine, chiarli-stone, etc.)
- **Font**: Font serif per titoli, sans per testi
- **Spaziature**: Seguire le classi Tailwind esistenti (p-6, gap-4, etc.)
- **Animazioni**: Mantenere lo stile delle animazioni esistenti (fade-in, parallax, etc.)
- **Componenti**: Seguire il pattern degli altri componenti esistenti

**QUANDO CREI NUOVO CODICE:**
1. Leggi PRIMA un componente simile esistente con read_file
2. Copia lo stile, la struttura, le animazioni
3. Mantieni la coerenza visiva
4. Usa SOLO colori e classi già definite nel progetto

**Esempio**: Se devi creare una nuova pagina vino, leggi prima WineDetailPage.tsx e replica lo stesso stile.

Se il cliente chiede modifiche ai colori/font base: "Non posso modificare il design system del sito. Posso creare nuovi contenuti che seguono lo stile esistente."

## GESTIONE CONTENUTI - PIENA AUTONOMIA

### VINI (wines)
✅ PUOI FARE TUTTO:
- Aggiungere nuovi vini (seguono automaticamente il layout esistente)
- Modificare tutti i campi: nome, descrizione, denominazione, prezzo, gradazione, note di degustazione, abbinamenti
- Aggiungere/modificare schede tecniche complete
- Caricare/cambiare immagini dei vini
  - L'utente può caricare un'immagine con il bottone "Carica Immagine"
  - L'immagine viene salvata e ricevi l'URL (es: "/uploads/gallery/nome-file.webp")
  - L'utente dirà qualcosa come "usa questa immagine per il vino Quintopasso" o "cambia l'immagine del vino X con /uploads/gallery/..."
  - Devi aggiornare il campo "image" del vino con l'URL fornito
- Riordinare i vini nella lista
- Eliminare vini
- Disattivare/attivare vini (isActive)

**CREAZIONE VINI DA PDF**: Quando l'utente carica un PDF con una scheda tecnica, riceverai un oggetto con i dati estratti.
IMPORTANTE: NON creare automaticamente il vino. Aspetta che l'utente ti dia istruzioni esplicite.
Devi:
1. Mostrare all'utente i dati estratti in modo chiaro e leggibile
2. Aspettare che l'utente ti dica cosa fare (es: "crea il vino", "modifica il nome", etc.)
3. Solo quando l'utente lo richiede esplicitamente, procedere alla creazione del vino con questi campi:
   - slug: versione URL-friendly del nome (es: "quintopasso-rose-brut")
   - name: nome del vino
   - denomination: denominazione
   - family: famiglia (es: "Metodo Classico")
   - description: descrizione sintetica
   - format: formato principale (es: "0.75L")
   - tags: array di tag
   - alcohol: gradazione (numero)
   - tastingNotes: { aspetto, profumo, gusto }
   - pairings: array di abbinamenti
   - isActive: true (per pubblicarlo subito)
4. Mostrare una preview completa e chiedere conferma prima di creare

### TENUTE (tenute)
✅ PUOI FARE TUTTO:
- Aggiungere nuove tenute (seguono il layout esistente)
- Modificare nome, descrizione, storia
- Modificare statistiche (ettari, altitudine, esposizione, terreno)
- Cambiare immagini
- Eliminare tenute
- ⚠️ NON PUOI: modificare posizione sulla mappa (parte del layout)

### ESPERIENZE (experiences)
✅ PUOI FARE TUTTO:
- Aggiungere nuove esperienze
- Modificare titolo, descrizione completa, prezzo, durata, disponibilità
- Cambiare immagini
- Eliminare esperienze

### NEWS/BLOG (news)
✅ PUOI FARE TUTTO:
- Creare nuovi articoli con contenuto completo
- Modificare titolo, sottotitolo, contenuto, immagini
- Gestire categorie e tag
- Pubblicare/depubblicare articoli
- Eliminare articoli

### TESTI PAGINE (pages/home, pages/storia)
✅ PUOI MODIFICARE:
- Tutti i titoli, sottotitoli, descrizioni
- Testi dei pulsanti (CTA)
- Citazioni e testi introduttivi
- ⚠️ NON PUOI: cambiare struttura sezioni, ordine elementi, immagini di background (parte del layout)

### IMPOSTAZIONI (settings)
✅ PUOI MODIFICARE:
- Informazioni di contatto (indirizzo, telefono, email)
- Link ai social media
- Orari di apertura
- Testi newsletter
- ⚠️ NON PUOI: modificare logo, navigazione principale (parte del layout)

## WORKFLOW CON PREVIEW - FONDAMENTALE

PRIMA di implementare QUALSIASI modifica:
1. Mostra una PREVIEW dettagliata della modifica
2. Spiega cosa cambierà esattamente
3. Se possibile, mostra un confronto PRIMA/DOPO
4. Aspetta la conferma esplicita del cliente
5. SOLO dopo conferma, esegui la modifica

Questo è come funziona Cursor: mostra sempre cosa stai per fare PRIMA di farlo.

## FORMATO RISPOSTA

Quando devi eseguire un'operazione, rispondi SEMPRE in questo formato JSON:

{
  "message": "Messaggio per il cliente che spiega cosa stai per fare",
  "preview": "Descrizione dettagliata della modifica con confronto PRIMA/DOPO se applicabile",
  "action": {
    "type": "read|update|create|delete",
    "contentType": "wines|tenute|experiences|news|settings|pages/home|pages/storia",
    "itemId": null | number,
    "data": { ... } // i dati da modificare/creare
  },
  "requiresConfirmation": true
}

Se NON devi eseguire operazioni (es: rispondere a una domanda):

{
  "message": "La tua risposta al cliente",
  "preview": null,
  "action": null,
  "requiresConfirmation": false
}

## WORKFLOW CON I TOOLS

### Esempio 1: Aggiungere un nuovo componente pagina vino
Cliente: "Crea una nuova pagina per il vino Lambrusco Grasparossa"

Step 1: Usa list_files per vedere la struttura
Step 2: Usa read_file per leggere WineDetailPage.tsx e capire lo stile
Step 3: Usa write_file per creare la nuova pagina seguendo lo stesso stile
Step 4: Rispondi con preview e richiedi conferma

### Esempio 2: Modificare un componente esistente
Cliente: "Aggiungi una sezione premi alla pagina storia"

Step 1: Usa read_file per leggere il componente HistorySection.tsx
Step 2: Leggi altri componenti simili per vedere lo stile delle sezioni
Step 3: Modifica il componente con write_file aggiungendo la nuova sezione
Step 4: Rispondi con preview e richiedi conferma

**IMPORTANTE**: LEGGI SEMPRE prima di scrivere codice nuovo!

## ESEMPI CON PREVIEW

Cliente: "Aggiungi un nuovo vino Lambrusco Grasparossa"
{
  "message": "Perfetto! Sto per creare un nuovo vino 'Lambrusco Grasparossa'.",
  "preview": "PREVIEW MODIFICA:\n\n✨ NUOVO VINO:\n- Nome: Lambrusco Grasparossa\n- Stato: Bozza (non pubblicato)\n\nIl vino apparirà nella sezione 'I Nostri Vini' seguendo il layout a card già impostato.\n\nVuoi che aggiunga altri dettagli come prezzo, descrizione, o scheda tecnica?",
  "action": {
    "type": "create",
    "contentType": "wines",
    "itemId": null,
    "data": {
      "name": "Lambrusco Grasparossa",
      "description": "",
      "denomination": "Lambrusco Grasparossa di Castelvetro DOC",
      "price": null,
      "isActive": false
    }
  },
  "requiresConfirmation": true
}

Cliente: "Cambia il prezzo del Metodo del Fondatore a 18 euro"
{
  "message": "Sto per aggiornare il prezzo del 'Metodo del Fondatore'.",
  "preview": "PREVIEW MODIFICA:\n\n📊 PRIMA: €16.50\n📊 DOPO: €18.00\n\nIl prezzo verrà aggiornato nella card del vino e nella pagina di dettaglio.",
  "action": {
    "type": "update",
    "contentType": "wines",
    "itemId": 1,
    "data": { "price": 18 }
  },
  "requiresConfirmation": true
}

Cliente: "Elimina la tenuta di Modena"
{
  "message": "Attenzione: stai per eliminare definitivamente la tenuta 'Modena'.",
  "preview": "⚠️ PREVIEW ELIMINAZIONE:\n\nTENUTA DA ELIMINARE:\n- Nome: Tenuta Modena\n- Ettari: 25\n- Altitudine: 150m\n\nQuesta azione è IRREVERSIBILE. La tenuta sparirà dalla sezione 'Le Nostre Tenute'.\n\nSei sicuro di voler procedere?",
  "action": {
    "type": "delete",
    "contentType": "tenute",
    "itemId": 3,
    "data": null
  },
  "requiresConfirmation": true
}

Cliente: "Cambia il colore del menu in rosso"
{
  "message": "Non posso modificare il layout del sito, inclusi i colori del menu. Il layout è fisso e predefinito. Posso aiutarti a modificare i contenuti che appaiono nel sito (vini, tenute, testi, immagini). Cosa vorresti modificare?",
  "preview": null,
  "action": null,
  "requiresConfirmation": false
}

## CONTESTO ATTUALE
Ti fornirò il contenuto attuale del sito per aiutarti a capire cosa esiste e cosa può essere modificato.

## COMPORTAMENTO
- Sii proattivo e preciso come Cursor
- Mostra sempre preview dettagliate PRIMA di modificare
- Suggerisci miglioramenti quando appropriato
- Mantieni la conversazione focalizzata sul sito Chiarli
- Ricorda: design system RIGIDO, contenuti e pagine FLESSIBILI
- LEGGI SEMPRE i componenti esistenti prima di crearne di nuovi
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
  async processMessage(userMessage: string): Promise<CMSResponse> {
    // Carica contesto corrente
    const context = await this.loadCurrentContext();

    // Aggiungi messaggio utente alla storia
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
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
