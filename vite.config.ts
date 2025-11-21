import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // Use repo subpath for production builds (GitHub Pages), root for dev
  base: process.env.NODE_ENV === 'production' ? '/kdp-puzzle-generator/' : '/',
  plugins: [react()],

  // Path aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/core': path.resolve(__dirname, './src/core'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/core/utils'),
      '@/config': path.resolve(__dirname, './src/config'),
    },
  },

  // Development server
  server: {
    port: 5173,
    strictPort: false,
    open: true,
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'pdf-vendor': ['jspdf', 'jspdf-autotable', 'jszip'],
          'ui-vendor': ['zustand', 'react-hook-form', 'zod'],
        },
      },
    },
    // Increase chunk size warning limit (for PDF libraries)
    chunkSizeWarningLimit: 1000,
  },

  // Preview server (for production builds)
  preview: {
    port: 4173,
    strictPort: false,
    open: true,
  },

  // Test configuration (Vitest)
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/*.d.ts',
        '**/types.ts',
      ],
    },
  },
});
