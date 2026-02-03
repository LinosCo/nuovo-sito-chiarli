import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 5173,
        host: '0.0.0.0',
        cors: true,
        watch: {
          usePolling: true, // Necessario per Railway/Docker
          ignored: ['**/cms/dashboard/**', '**/node_modules/**']
        },
        hmr: {
          // HMR attraverso proxy Railway
          clientPort: 443,
          protocol: 'wss'
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      optimizeDeps: {
        exclude: ['cms/dashboard']
      }
    };
});
