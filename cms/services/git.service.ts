import simpleGit, { SimpleGit } from 'simple-git';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_PATH = process.env.SITE_PATH || path.join(__dirname, '../..');

interface CommitInfo {
  hash: string;
  date: string;
  message: string;
  author: string;
}

/**
 * Servizio per gestire il versioning Git automatico
 */
export class GitService {
  private git: SimpleGit;
  private isEnabled: boolean;

  constructor() {
    this.git = simpleGit(SITE_PATH);
    this.isEnabled = process.env.GIT_AUTO_COMMIT === 'true';
  }

  /**
   * Crea un commit automatico dopo una modifica e fa push
   */
  async autoCommit(message: string, files: string[] = ['public/content/']): Promise<string | null> {
    if (!this.isEnabled) {
      console.log('[Git] Auto-commit disabilitato');
      return null;
    }

    try {
      // Aggiungi i file modificati
      await this.git.add(files);

      // Verifica se ci sono modifiche da committare
      const status = await this.git.status();
      if (status.staged.length === 0) {
        console.log('[Git] Nessuna modifica da committare');
        return null;
      }

      // Crea il commit
      const commitMessage = `[CMS] ${message}`;
      const result = await this.git.commit(commitMessage, undefined, {
        '--author': `${process.env.GIT_AUTHOR_NAME || 'CMS Bot'} <${process.env.GIT_AUTHOR_EMAIL || 'cms@chiarli.it'}>`,
      });

      console.log(`[Git] Commit creato: ${result.commit}`);

      // Push automatico se configurato
      if (process.env.GIT_AUTO_PUSH === 'true') {
        await this.push();
      }

      return result.commit;
    } catch (error: any) {
      console.error('[Git] Errore nel commit:', error.message);
      return null;
    }
  }

  /**
   * Fa push delle modifiche su GitHub
   */
  async push(): Promise<boolean> {
    try {
      // Se c'è un token GitHub, configura l'URL con autenticazione
      const githubToken = process.env.GITHUB_TOKEN;
      const githubRepo = process.env.GITHUB_REPO; // formato: owner/repo

      if (githubToken && githubRepo) {
        const remoteUrl = `https://${githubToken}@github.com/${githubRepo}.git`;
        await this.git.remote(['set-url', 'origin', remoteUrl]);
      }

      await this.git.push('origin', 'main');
      console.log('[Git] Push completato con successo');
      return true;
    } catch (error: any) {
      console.error('[Git] Errore nel push:', error.message);
      return false;
    }
  }

  /**
   * Ottiene la storia dei commit per i contenuti
   */
  async getHistory(limit: number = 20): Promise<CommitInfo[]> {
    try {
      const log = await this.git.log({
        maxCount: limit,
        file: 'public/content/',
      });

      return log.all.map((commit) => ({
        hash: commit.hash.substring(0, 7),
        date: commit.date,
        message: commit.message,
        author: commit.author_name,
      }));
    } catch (error: any) {
      console.error('[Git] Errore nel recupero storia:', error.message);
      return [];
    }
  }

  /**
   * Ripristina un file a una versione precedente
   */
  async restoreFile(filePath: string, commitHash: string): Promise<boolean> {
    try {
      await this.git.checkout([commitHash, '--', filePath]);
      console.log(`[Git] File ${filePath} ripristinato a ${commitHash}`);
      return true;
    } catch (error: any) {
      console.error('[Git] Errore nel ripristino:', error.message);
      return false;
    }
  }

  /**
   * Ripristina tutti i contenuti a una versione precedente
   */
  async restoreContent(commitHash: string): Promise<boolean> {
    try {
      await this.git.checkout([commitHash, '--', 'public/content/']);
      console.log(`[Git] Contenuti ripristinati a ${commitHash}`);

      // Crea un commit di rollback
      await this.autoCommit(`Rollback a versione ${commitHash}`, ['public/content/']);
      return true;
    } catch (error: any) {
      console.error('[Git] Errore nel rollback:', error.message);
      return false;
    }
  }

  /**
   * Mostra le differenze tra la versione corrente e un commit
   */
  async getDiff(commitHash: string, filePath?: string): Promise<string> {
    try {
      const args = [commitHash, 'HEAD'];
      if (filePath) {
        args.push('--', filePath);
      } else {
        args.push('--', 'public/content/');
      }

      const diff = await this.git.diff(args);
      return diff;
    } catch (error: any) {
      console.error('[Git] Errore nel diff:', error.message);
      return '';
    }
  }

  /**
   * Verifica lo stato del repository
   */
  async getStatus(): Promise<{ modified: string[]; staged: string[]; untracked: string[] }> {
    try {
      const status = await this.git.status();
      return {
        modified: status.modified.filter((f) => f.startsWith('public/content/')),
        staged: status.staged.filter((f) => f.startsWith('public/content/')),
        untracked: status.not_added.filter((f) => f.startsWith('public/content/')),
      };
    } catch (error: any) {
      console.error('[Git] Errore nello status:', error.message);
      return { modified: [], staged: [], untracked: [] };
    }
  }
}

export const gitService = new GitService();
