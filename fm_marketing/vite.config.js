import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  define: {
    // 환경변수를 클라이언트에서 사용할 수 있도록 설정
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  },
  server: {
    fs: {
      allow: ['..']
    }
  },
  optimizeDeps: {
    include: ['mysql2', 'typeorm', 'reflect-metadata']
  },
  ssr: {
    noExternal: ['typeorm']
  }
});
