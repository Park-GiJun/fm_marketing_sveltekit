import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 5173,
    host: true
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['typeorm']
  },
  ssr: {
    external: ['typeorm', 'mysql2', 'reflect-metadata'],
    noExternal: []
  },
  build: {
    rollupOptions: {
      external: ['typeorm', 'mysql2', 'reflect-metadata']
    }
  }
});
