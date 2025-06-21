import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Para desarrollo local con XAMPP
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist', // ⚠️ Obligatorio para que Vercel funcione correctamente
  },
}));

