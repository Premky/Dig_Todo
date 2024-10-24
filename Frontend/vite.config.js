import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',  // Ensures the base path for routing
  build: {
    outDir: 'dist',  // Ensure the output directory is correct
  },
  server: {
    historyApiFallback: true,  // This tells the dev server to fallback to index.html
  },
});
