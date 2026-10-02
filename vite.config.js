import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Keep the historical CRA output directory name so .gitignore
    // and any existing deploy tooling that expects /build keep working.
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('@supabase')) return 'supabase';
          if (id.includes('@tanstack')) return 'query';
          if (id.includes('react-icons') || id.includes('lucide-react')) return 'icons';
          if (id.includes('@vercel')) return 'monitoring';
          if (id.includes('react-helmet-async')) return 'seo';
          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/react-router/') ||
            id.includes('/node_modules/react-router-dom/') ||
            id.includes('/node_modules/scheduler/')
          ) return 'react-vendor';
          return undefined;
        },
      },
    },
  },
  server: {
    port: 3000,
  },
});
