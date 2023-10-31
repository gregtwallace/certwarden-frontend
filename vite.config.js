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
  plugins: [
    react(),
    // add preload attribute and nonce place holder
    {
      name: 'html-inject-data',
      enforce: 'post',
      transformIndexHtml(html) {
        const regex = /<(style|script|link) (.*)>/gi;
        const replacer = (_, p1, p2) => {
          // add nonce?
          if (
            p1 === 'style' ||
            // p1 === 'script' ||
            // if link, only nonce for stylesheet and modulepreload
            (p1 === 'link' &&
              p2.includes('rel="stylesheet"'))
              //  || p2.includes('rel="modulepreload"')
          ) {
            p2 = `nonce="{SERVER-CSP-NONCE}" ${p2}`;
          }

          // always add data preload
          return `<${p1} data-preload="true" ${p2}>`;
        };

        return html.replace(regex, replacer);
      },
    },
  ],
  base: '/legocerthub/app',
});
