import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'emotion_sheet',
              test: /node_modules[\\/]@emotion[\\/]sheet/,
              priority: 20,
            },
          ],
        },
      },
    },
  },
  plugins: [react()],
  base: '/certwarden/app',
  html: {
    cspNonce: '{SERVER-CSP-NONCE}',
  },
});
