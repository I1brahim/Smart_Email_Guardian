import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: { outDir: 'build' },
  server: { proxy: { '/scan': 'http://127.0.0.1:5000' } },
  test: { environment: 'jsdom', globals: true, setupFiles: './src/setupTests.js' },
});
