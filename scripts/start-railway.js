/**
 * Script per avviare CMS su Railway
 * - CMS Express: porta 3001
 *
 * La preview usa il sito Vercel con ?cms_preview=true
 * che carica i contenuti dall'API CMS
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

console.log('🚀 Avvio CMS Railway...');

// Avvia CMS Express (porta 3001)
const cms = spawn('node', ['dist/server.js'], {
  cwd: path.join(rootDir, 'cms'),
  stdio: 'inherit',
  env: { ...process.env }
});

cms.on('error', (err) => {
  console.error('❌ Errore CMS:', err);
});

// Gestione chiusura
process.on('SIGTERM', () => {
  console.log('🛑 Chiusura CMS...');
  cms.kill();
  process.exit(0);
});
