import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    'process.env': {}
  },
  server: {
    port: 3000,
    host: 'localhost',
    proxy: {
      '/.identitytoolkit': {
        target: 'https://identitytoolkit.googleapis.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
