import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      // Target browsers modernos para JS menor
      target: 'es2020',
      // Reporta somente chunks > 500kb como aviso
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          // Separa as bibliotecas mais pesadas em chunks próprios
          // para aproveitar cache do browser em deploys futuros
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'motion-vendor': ['motion'],
            'icons-vendor': ['lucide-react'],
          },
        },
      },
      // Minificação avançada com esbuild (padrão do Vite, ultra-rápido)
      minify: 'esbuild',
    },
  };
});
