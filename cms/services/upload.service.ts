import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_PATH = process.env.UPLOADS_PATH || path.join(__dirname, '../../public/uploads');

// Immagini protette (non eliminabili)
const PROTECTED_IMAGES = [
  '/foto/cletochiarli-2-01.svg',
  '/foto/cletoc-1.svg',
  '/Mappa_regione_emilia_romagna.png',
  '/Mappa_regione_emilia_romagna.jpg',
];

// Configurazione
const CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.svg'],
  outputFormat: 'webp' as const,
  quality: 85,
  maxWidth: 1920,
  maxHeight: 1920,
};

interface UploadResult {
  success: boolean;
  path?: string;
  url?: string;
  error?: string;
}

interface ImageInfo {
  path: string;
  url: string;
  size: number;
  width?: number;
  height?: number;
}

/**
 * Servizio per gestire l'upload e la gestione delle immagini
 */
export class UploadService {
  private uploadsPath: string;

  constructor() {
    this.uploadsPath = UPLOADS_PATH;
    this.ensureUploadDirs();
  }

  /**
   * Crea le cartelle di upload se non esistono
   */
  private async ensureUploadDirs() {
    const dirs = ['wines', 'news', 'tenute', 'experiences', 'gallery'];
    for (const dir of dirs) {
      const fullPath = path.join(this.uploadsPath, dir);
      try {
        await fs.mkdir(fullPath, { recursive: true });
      } catch (e) {
        // Ignora se esiste già
      }
    }
  }

  /**
   * Valida un file prima dell'upload
   */
  private validateFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string
  ): { valid: boolean; error?: string } {
    // Controlla dimensione
    if (buffer.length > CONFIG.maxFileSize) {
      return { valid: false, error: `File troppo grande. Max ${CONFIG.maxFileSize / 1024 / 1024}MB` };
    }

    // Controlla tipo MIME
    if (!CONFIG.allowedMimeTypes.includes(mimeType)) {
      return { valid: false, error: `Tipo file non supportato. Usa: ${CONFIG.allowedExtensions.join(', ')}` };
    }

    // Controlla estensione
    const ext = path.extname(originalName).toLowerCase();
    if (!CONFIG.allowedExtensions.includes(ext)) {
      return { valid: false, error: `Estensione non supportata. Usa: ${CONFIG.allowedExtensions.join(', ')}` };
    }

    return { valid: true };
  }

  /**
   * Carica e ottimizza un'immagine
   */
  async upload(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    category: 'wines' | 'news' | 'tenute' | 'experiences' | 'gallery'
  ): Promise<UploadResult> {
    // Valida
    const validation = this.validateFile(buffer, originalName, mimeType);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    try {
      // Genera nome unico
      const ext = path.extname(originalName).toLowerCase();
      const baseName = path.basename(originalName, ext);
      const uniqueName = `${baseName}-${uuidv4().substring(0, 8)}`;

      // Per SVG, non processare con sharp
      if (ext === '.svg') {
        const fileName = `${uniqueName}.svg`;
        const filePath = path.join(this.uploadsPath, category, fileName);
        await fs.writeFile(filePath, buffer);

        return {
          success: true,
          path: filePath,
          url: `/uploads/${category}/${fileName}`,
        };
      }

      // Ottimizza immagine con sharp
      const outputFileName = `${uniqueName}.webp`;
      const outputPath = path.join(this.uploadsPath, category, outputFileName);

      await sharp(buffer)
        .resize(CONFIG.maxWidth, CONFIG.maxHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: CONFIG.quality })
        .toFile(outputPath);

      return {
        success: true,
        path: outputPath,
        url: `/uploads/${category}/${outputFileName}`,
      };
    } catch (error: any) {
      return { success: false, error: `Errore elaborazione immagine: ${error.message}` };
    }
  }

  /**
   * Elimina un'immagine
   */
  async delete(imagePath: string): Promise<{ success: boolean; error?: string }> {
    // Controlla se è protetta
    if (PROTECTED_IMAGES.some((p) => imagePath.includes(p))) {
      return { success: false, error: 'Questa immagine è protetta e non può essere eliminata' };
    }

    // Permetti solo eliminazione da /uploads/
    if (!imagePath.includes('/uploads/')) {
      return { success: false, error: 'Puoi eliminare solo immagini dalla cartella uploads' };
    }

    try {
      // Costruisci il path completo
      const fullPath = path.join(this.uploadsPath, '..', imagePath.replace('/uploads/', 'uploads/'));
      await fs.unlink(fullPath);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: `Errore eliminazione: ${error.message}` };
    }
  }

  /**
   * Lista le immagini in una categoria
   */
  async list(category: 'wines' | 'news' | 'tenute' | 'experiences' | 'gallery'): Promise<ImageInfo[]> {
    try {
      const dirPath = path.join(this.uploadsPath, category);
      const files = await fs.readdir(dirPath);
      const images: ImageInfo[] = [];

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);

        if (stats.isFile()) {
          const info: ImageInfo = {
            path: filePath,
            url: `/uploads/${category}/${file}`,
            size: stats.size,
          };

          // Prova a ottenere dimensioni
          try {
            const metadata = await sharp(filePath).metadata();
            info.width = metadata.width;
            info.height = metadata.height;
          } catch {
            // Ignora per SVG o file non immagine
          }

          images.push(info);
        }
      }

      return images;
    } catch (error: any) {
      console.error(`[Upload] Errore lista immagini: ${error.message}`);
      return [];
    }
  }

  /**
   * Verifica se un'immagine è protetta
   */
  isProtected(imagePath: string): boolean {
    return PROTECTED_IMAGES.some((p) => imagePath.includes(p));
  }
}

export const uploadService = new UploadService();
