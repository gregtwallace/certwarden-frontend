import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // if emotion/sheet
            if (id.includes('emotion/sheet')) {
              return 'emotion_sheet';
            }
          }
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
