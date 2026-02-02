import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_PATH = process.env.CONTENT_PATH || path.join(__dirname, '../../../public/content');

interface CommitInfo {
  hash: string;
  date: string;
  message: string;
  author: string;
}

/**
 * Servizio per gestire il versioning Git via GitHub API
 */
export class GitService {
  private isEnabled: boolean;
  private githubToken: string | undefined;
  private githubRepo: string | undefined;

  constructor() {
    this.isEnabled = process.env.GIT_AUTO_COMMIT === 'true';
    this.githubToken = process.env.GITHUB_TOKEN;
    this.githubRepo = process.env.GITHUB_REPO;
  }

  /**
   * Crea un commit su GitHub via API dopo una modifica
   */
  async autoCommit(message: string, files: string[] = ['public/content/']): Promise<string | null> {
    if (!this.isEnabled) {
      console.log('[Git] Auto-commit disabilitato');
      return null;
    }

    if (!this.githubToken || !this.githubRepo) {
      console.log('[Git] GITHUB_TOKEN o GITHUB_REPO non configurati');
      return null;
    }

    try {
      const commitMessage = `[CMS] ${message}`;

      // Usa GitHub API per creare il commit
      const result = await this.commitViaGitHubAPI(commitMessage);

      if (result) {
        console.log(`[Git] Commit creato via GitHub API: ${result}`);
      }

      return result;
    } catch (error: any) {
      console.error('[Git] Errore nel commit:', error.message);
      return null;
    }
  }

  /**
   * Commit via GitHub API
   */
  private async commitViaGitHubAPI(message: string): Promise<string | null> {
    const token = this.githubToken!;
    const repo = this.githubRepo!;
    const branch = 'main';

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };

    try {
      // 1. Ottieni il riferimento del branch
      const refResponse = await fetch(`https://api.github.com/repos/${repo}/git/refs/heads/${branch}`, { headers });
      if (!refResponse.ok) {
        throw new Error(`Errore nel recupero ref: ${refResponse.status}`);
      }
      const refData = await refResponse.json();
      const latestCommitSha = refData.object.sha;

      // 2. Ottieni il commit corrente
      const commitResponse = await fetch(`https://api.github.com/repos/${repo}/git/commits/${latestCommitSha}`, { headers });
      if (!commitResponse.ok) {
        throw new Error(`Errore nel recupero commit: ${commitResponse.status}`);
      }
      const commitData = await commitResponse.json();
      const treeSha = commitData.tree.sha;

      // 3. Leggi i file modificati e crea i blob
      const contentFiles = await this.getContentFiles();
      const treeItems = [];

      for (const file of contentFiles) {
        const content = await fs.readFile(file.localPath, 'utf-8');

        // Crea blob
        const blobResponse = await fetch(`https://api.github.com/repos/${repo}/git/blobs`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            content: content,
            encoding: 'utf-8'
          })
        });

        if (!blobResponse.ok) {
          console.error(`[Git] Errore creazione blob per ${file.repoPath}`);
          continue;
        }

        const blobData = await blobResponse.json();

        treeItems.push({
          path: file.repoPath,
          mode: '100644',
          type: 'blob',
          sha: blobData.sha
        });
      }

      if (treeItems.length === 0) {
        console.log('[Git] Nessun file da committare');
        return null;
      }

      // 4. Crea nuovo tree
      const newTreeResponse = await fetch(`https://api.github.com/repos/${repo}/git/trees`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          base_tree: treeSha,
          tree: treeItems
        })
      });

      if (!newTreeResponse.ok) {
        throw new Error(`Errore creazione tree: ${newTreeResponse.status}`);
      }
      const newTreeData = await newTreeResponse.json();

      // 5. Crea nuovo commit
      const newCommitResponse = await fetch(`https://api.github.com/repos/${repo}/git/commits`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: message,
          tree: newTreeData.sha,
          parents: [latestCommitSha],
          author: {
            name: process.env.GIT_AUTHOR_NAME || 'CMS Bot',
            email: process.env.GIT_AUTHOR_EMAIL || 'cms@chiarli.it',
            date: new Date().toISOString()
          }
        })
      });

      if (!newCommitResponse.ok) {
        throw new Error(`Errore creazione commit: ${newCommitResponse.status}`);
      }
      const newCommitData = await newCommitResponse.json();

      // 6. Aggiorna il riferimento del branch
      const updateRefResponse = await fetch(`https://api.github.com/repos/${repo}/git/refs/heads/${branch}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          sha: newCommitData.sha
        })
      });

      if (!updateRefResponse.ok) {
        throw new Error(`Errore aggiornamento ref: ${updateRefResponse.status}`);
      }

      console.log('[Git] Push completato via GitHub API');
      return newCommitData.sha.substring(0, 7);

    } catch (error: any) {
      console.error('[Git] Errore GitHub API:', error.message);
      return null;
    }
  }

  /**
   * Ottieni lista dei file content da committare
   */
  private async getContentFiles(): Promise<{localPath: string, repoPath: string}[]> {
    const files: {localPath: string, repoPath: string}[] = [];

    const scanDir = async (dir: string, repoBase: string) => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          const localPath = path.join(dir, entry.name);
          const repoPath = path.join(repoBase, entry.name).replace(/\\/g, '/');

          if (entry.isDirectory()) {
            await scanDir(localPath, repoPath);
          } else if (entry.name.endsWith('.json')) {
            files.push({ localPath, repoPath });
          }
        }
      } catch (error) {
        // Directory non esiste, ignora
      }
    };

    await scanDir(CONTENT_PATH, 'public/content');
    return files;
  }

  /**
   * Ottiene la storia dei commit per i contenuti via GitHub API
   */
  async getHistory(limit: number = 20): Promise<CommitInfo[]> {
    if (!this.githubToken || !this.githubRepo) {
      return [];
    }

    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.githubRepo}/commits?path=public/content&per_page=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${this.githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const commits = await response.json();
      return commits.map((commit: any) => ({
        hash: commit.sha.substring(0, 7),
        date: commit.commit.author.date,
        message: commit.commit.message,
        author: commit.commit.author.name,
      }));
    } catch (error: any) {
      console.error('[Git] Errore nel recupero storia:', error.message);
      return [];
    }
  }

  /**
   * Ripristina un file a una versione precedente (non implementato per GitHub API)
   */
  async restoreFile(_filePath: string, _commitHash: string): Promise<boolean> {
    console.log('[Git] restoreFile non disponibile con GitHub API');
    return false;
  }

  /**
   * Ripristina tutti i contenuti a una versione precedente (non implementato per GitHub API)
   */
  async restoreContent(_commitHash: string): Promise<boolean> {
    console.log('[Git] restoreContent non disponibile con GitHub API');
    return false;
  }

  /**
   * Mostra le differenze (non implementato per GitHub API)
   */
  async getDiff(_commitHash: string, _filePath?: string): Promise<string> {
    return '';
  }

  /**
   * Verifica lo stato del repository
   */
  async getStatus(): Promise<{ modified: string[]; staged: string[]; untracked: string[] }> {
    return { modified: [], staged: [], untracked: [] };
  }
}

export const gitService = new GitService();
