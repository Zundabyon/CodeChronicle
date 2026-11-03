import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // The standalone HTML documents in docs/ are not game entry points.
  optimizeDeps: {
    entries: ['index.html'],
    include: ['react-dom/client'],
  },
});
