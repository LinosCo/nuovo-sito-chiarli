import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isPreview = process.env.ENABLE_VITE_PREVIEW === 'true';

    return {
      // In preview mode, tutti gli asset devono avere /preview/ come prefisso
      base: isPreview ? '/preview/' : '/',
      server: {
        port: 5173,
        host: '0.0.0.0',
        cors: true,
        watch: {
          usePolling: true,
          ignored: ['**/cms/dashboard/**', '**/node_modules/**']
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
