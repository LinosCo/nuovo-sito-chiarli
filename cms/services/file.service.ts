import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '../..');

// File e directory che NON possono essere modificati
const FORBIDDEN_PATHS = [
  'node_modules',
  '.git',
  'package-lock.json',
  'cms/services/file.service.ts', // Non può modificare se stesso
  '.env',
];

// Estensioni permesse
const ALLOWED_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js', '.json', '.css', '.md'];

export class FileService {
  /**
   * Verifica se un path è sicuro e permesso
   */
  private isPathAllowed(filePath: string): boolean {
    const relativePath = path.relative(PROJECT_ROOT, filePath);

    // Non può andare fuori dal progetto
    if (relativePath.startsWith('..')) {
      return false;
    }

    // Controlla paths proibiti
    for (const forbidden of FORBIDDEN_PATHS) {
      if (relativePath.includes(forbidden)) {
        return false;
      }
    }

    // Controlla estensione
    const ext = path.extname(filePath);
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return false;
    }

    return true;
  }

  /**
   * Legge un file del progetto
   */
  async readFile(relativePath: string): Promise<{ success: boolean; content?: string; error?: string }> {
    try {
      const fullPath = path.join(PROJECT_ROOT, relativePath);

      if (!this.isPathAllowed(fullPath)) {
        return { success: false, error: 'Path non permesso' };
      }

      const content = await fs.readFile(fullPath, 'utf-8');
      return { success: true, content };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Scrive un file del progetto
   */
  async writeFile(
    relativePath: string,
    content: string,
    author: string = 'cms'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const fullPath = path.join(PROJECT_ROOT, relativePath);

      if (!this.isPathAllowed(fullPath)) {
        return { success: false, error: 'Path non permesso' };
      }

      await fs.writeFile(fullPath, content, 'utf-8');
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Lista file in una directory
   */
  async listFiles(
    relativePath: string = '.'
  ): Promise<{ success: boolean; files?: string[]; error?: string }> {
    try {
      const fullPath = path.join(PROJECT_ROOT, relativePath);

      if (!this.isPathAllowed(fullPath + '/dummy.ts')) {
        return { success: false, error: 'Path non permesso' };
      }

      const entries = await fs.readdir(fullPath, { withFileTypes: true });
      const files = entries
        .filter((entry) => {
          // Filtra directory e file proibiti
          if (FORBIDDEN_PATHS.some((forbidden) => entry.name.includes(forbidden))) {
            return false;
          }
          // Solo file con estensioni permesse
          if (entry.isFile()) {
            const ext = path.extname(entry.name);
            return ALLOWED_EXTENSIONS.includes(ext);
          }
          return entry.isDirectory();
        })
        .map((entry) => (entry.isDirectory() ? `${entry.name}/` : entry.name));

      return { success: true, files };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Verifica se un file esiste
   */
  async fileExists(relativePath: string): Promise<boolean> {
    try {
      const fullPath = path.join(PROJECT_ROOT, relativePath);
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }
}

export const fileService = new FileService();
