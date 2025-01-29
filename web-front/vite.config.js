/* import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
 */

/* import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import requireTransform from 'vite-plugin-require-transform';

export default defineConfig({
  plugins: [
    react(),
    requireTransform({
      fileRegex: /.(js|jsx|ts|tsx)$/,
    }),
  ],

}); */

// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'rollup-plugin-polyfill-node';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['global']
    })
  ],
  build: {
    rollupOptions: {
      plugins: [
        nodePolyfills({
          include: ['global']
        })
      ]
    }
  }
});








