import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_PATH = process.env.CONTENT_PATH || path.join(__dirname, '../../../src/content');

// Log per debug
console.log('[ContentService] __dirname:', __dirname);
console.log('[ContentService] CONTENT_PATH:', CONTENT_PATH);
console.log('[ContentService] env.CONTENT_PATH:', process.env.CONTENT_PATH);

export type ContentType = 'wines' | 'tenute' | 'experiences' | 'news' | 'settings' | 'pages/home' | 'pages/storia' | 'pages/metodo' | 'pages/sostenibilita';

interface ContentMeta {
  lastModified: string;
  modifiedBy: string;
}

/**
 * Servizio per gestire i contenuti JSON
 */
export class ContentService {
  private contentPath: string;

  constructor(contentPath?: string) {
    this.contentPath = contentPath || CONTENT_PATH;
  }

  /**
   * Ottiene il path del file per un tipo di contenuto
   */
  private getFilePath(contentType: ContentType): string {
    if (contentType.startsWith('pages/')) {
      return path.join(this.contentPath, `${contentType}.json`);
    }
    return path.join(this.contentPath, `${contentType}.json`);
  }

  /**
   * Legge un contenuto
   */
  async read<T>(contentType: ContentType): Promise<T> {
    const filePath = this.getFilePath(contentType);
    console.log(`[ContentService] Reading ${contentType} from: ${filePath}`);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content) as T;
    } catch (error: any) {
      console.error(`[ContentService] Error reading ${contentType}:`, error.message);
      throw error;
    }
  }

  /**
   * Scrive un contenuto (sovrascrive tutto il file)
   */
  async write<T extends { _meta?: ContentMeta }>(
    contentType: ContentType,
    data: T,
    modifiedBy: string = 'cms'
  ): Promise<T> {
    const filePath = this.getFilePath(contentType);

    // Aggiorna metadata
    data._meta = {
      lastModified: new Date().toISOString(),
      modifiedBy,
    };

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return data;
  }

  /**
   * Aggiorna un singolo item in un array (wines, tenute, etc.)
   */
  async updateItem<T extends { id: number }>(
    contentType: ContentType,
    itemId: number,
    updates: Partial<T>,
    modifiedBy: string = 'cms'
  ): Promise<T | null> {
    const data = await this.read<{ [key: string]: T[] | ContentMeta; _meta: ContentMeta }>(contentType);
    const key = contentType.replace('pages/', '');
    const items = data[key] as T[];

    const index = items.findIndex((item) => item.id === itemId);
    if (index === -1) return null;

    // Merge updates
    items[index] = { ...items[index], ...updates };
    data[key] = items as any;

    await this.write(contentType, data, modifiedBy);
    return items[index];
  }

  /**
   * Aggiunge un nuovo item
   */
  async addItem<T extends { id?: number }>(
    contentType: ContentType,
    item: T,
    modifiedBy: string = 'cms'
  ): Promise<T> {
    const data = await this.read<{ [key: string]: T[] | ContentMeta; _meta: ContentMeta }>(contentType);
    const key = contentType.replace('pages/', '');
    const items = data[key] as T[];

    // Se l'item ha già un id (es: -1 per preview), lo rispetta. Altrimenti genera nuovo ID
    const newId = item.id !== undefined ? item.id : items.reduce((max, i) => Math.max(max, (i as any).id || 0), 0) + 1;
    const newItem = { ...item, id: newId } as T;

    items.push(newItem);
    data[key] = items as any;

    await this.write(contentType, data, modifiedBy);
    return newItem;
  }

  /**
   * Rimuove un item
   */
  async removeItem<T extends { id: number }>(
    contentType: ContentType,
    itemId: number,
    modifiedBy: string = 'cms'
  ): Promise<boolean> {
    const data = await this.read<{ [key: string]: T[] | ContentMeta; _meta: ContentMeta }>(contentType);
    const key = contentType.replace('pages/', '');
    const items = data[key] as T[];

    const index = items.findIndex((item) => item.id === itemId);
    if (index === -1) return false;

    items.splice(index, 1);
    data[key] = items as any;

    await this.write(contentType, data, modifiedBy);
    return true;
  }

  /**
   * Aggiorna campi specifici in un oggetto (per settings, pages)
   */
  async updateFields(
    contentType: ContentType,
    fieldPath: string,
    value: any,
    modifiedBy: string = 'cms'
  ): Promise<any> {
    const data = await this.read<any>(contentType);

    // Naviga nel path (es: "hero.titleLine1")
    const parts = fieldPath.split('.');
    let current = data;

    for (let i = 0; i < parts.length - 1; i++) {
      if (current[parts[i]] === undefined) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }

    // Imposta il valore
    current[parts[parts.length - 1]] = value;

    await this.write(contentType, data, modifiedBy);
    return data;
  }

  /**
   * Lista tutti i contenuti disponibili
   */
  async listAll(): Promise<{ type: ContentType; data: any }[]> {
    const types: ContentType[] = [
      'wines',
      'tenute',
      'experiences',
      'news',
      'settings',
      'pages/home',
      'pages/storia',
      'pages/metodo',
      'pages/sostenibilita',
    ];

    const results = await Promise.all(
      types.map(async (type) => {
        try {
          const data = await this.read(type);
          return { type, data };
        } catch {
          return { type, data: null };
        }
      })
    );

    return results.filter((r) => r.data !== null);
  }

  /**
   * Cerca contenuti per testo
   */
  async search(query: string): Promise<{ type: ContentType; matches: any[] }[]> {
    const all = await this.listAll();
    const results: { type: ContentType; matches: any[] }[] = [];
    const lowerQuery = query.toLowerCase();

    for (const { type, data } of all) {
      const matches: any[] = [];

      // Cerca in array (wines, tenute, etc.)
      const key = type.replace('pages/', '');
      if (Array.isArray(data[key])) {
        for (const item of data[key]) {
          const itemStr = JSON.stringify(item).toLowerCase();
          if (itemStr.includes(lowerQuery)) {
            matches.push(item);
          }
        }
      }

      if (matches.length > 0) {
        results.push({ type, matches });
      }
    }

    return results;
  }
}

export const contentService = new ContentService();
