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
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      target: 'es2020',
      chunkSizeWarningLimit: 500,
      minify: 'esbuild',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-gsap': ['gsap', '@gsap/react'],
            'vendor-stripe': ['@stripe/react-stripe-js', '@stripe/stripe-js'],
            'vendor-supabase': ['@supabase/supabase-js'],
            'vendor-ui': ['lucide-react', 'react-hot-toast'],
          },
        },
      },
    },
  };
});

