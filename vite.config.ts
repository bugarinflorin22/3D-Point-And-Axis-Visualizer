import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  // Pre-bundle lucide-react to avoid serving many individual icon ESM files
  // which can trigger ad-blockers (for example requests like
  // /node_modules/lucide-react/dist/esm/icons/fingerprint.js).
  // Including it here forces Vite to optimize the package into a single
  // module so the browser doesn't request per-icon files.
  optimizeDeps: {
    include: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
  },
});
