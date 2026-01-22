import React from 'react';
import ReactDOM from 'react-dom/client';
import { CMSDashboard } from './CMSDashboard';
import './styles.css';

console.log('🚀 [Dashboard] index.tsx caricato');
console.log('📍 [Dashboard] Location:', window.location.href);
console.log('🌐 [Dashboard] Environment:', {
  VITE_CMS_API_URL: import.meta.env.VITE_CMS_API_URL,
  VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
});

try {
  const rootElement = document.getElementById('root');
  console.log('📦 [Dashboard] Root element:', rootElement);

  if (!rootElement) {
    throw new Error('Root element non trovato!');
  }

  console.log('⚛️ [Dashboard] Creazione React root...');
  const root = ReactDOM.createRoot(rootElement);

  console.log('🎨 [Dashboard] Rendering CMSDashboard...');
  root.render(
    <React.StrictMode>
      <CMSDashboard />
    </React.StrictMode>
  );

  console.log('✅ [Dashboard] Rendering completato');
} catch (error) {
  console.error('❌ [Dashboard] Errore durante il rendering:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: monospace; background: #fee; color: #c00;">
      <h1>Errore Dashboard</h1>
      <pre>${error}</pre>
    </div>
  `;
}
