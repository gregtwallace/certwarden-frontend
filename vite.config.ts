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
              priority: 40,
            },
            {
              name: 'react-vendor',
              test: /node_modules[\\/](?:react|react-dom|react-router|scheduler)/,
              priority: 30,
            },
            {
              name: 'mui-icons',
              test: /node_modules[\\/]@mui[\\/]icons-material/,
              priority: 25,
            },
            {
              name: 'mui-vendor',
              test: /node_modules[\\/](?:@mui|@emotion|@popperjs)/,
              priority: 20,
            },
            {
              name: 'utils-vendor',
              test: /node_modules[\\/](?:axios|zod)/,
              priority: 15,
            },
            {
              name: 'vendor',
              test: /node_modules/,
              priority: 10,
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
