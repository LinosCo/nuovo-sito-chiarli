/**
 * Script per avviare CMS + Vite Dev Server su Railway
 * - CMS Express: porta 3001
 * - Vite Dev Server: porta 5173 (preview live)
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

console.log('🚀 Avvio servizi Railway...');
console.log('📁 Root directory:', rootDir);

// Avvia CMS Express (porta 3001)
const cms = spawn('node', ['dist/server.js'], {
  cwd: path.join(rootDir, 'cms'),
  stdio: 'inherit',
  env: { ...process.env }
});

cms.on('error', (err) => {
  console.error('❌ Errore CMS:', err);
});

// Avvia Vite Dev Server (porta 5173) - solo se VITE_PREVIEW è abilitato
if (process.env.ENABLE_VITE_PREVIEW === 'true') {
  console.log('🎨 Avvio Vite Dev Server per preview...');

  const vite = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5173'], {
    cwd: rootDir,
    stdio: 'inherit',
    env: { ...process.env }
  });

  vite.on('error', (err) => {
    console.error('❌ Errore Vite:', err);
  });

  vite.on('exit', (code) => {
    console.log(`Vite terminato con codice ${code}`);
  });
} else {
  console.log('ℹ️  Vite preview disabilitato (ENABLE_VITE_PREVIEW != true)');
}

// Gestione chiusura
process.on('SIGTERM', () => {
  console.log('🛑 Chiusura servizi...');
  cms.kill();
  process.exit(0);
});
