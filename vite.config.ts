import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/mortgage-portal/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    force: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: [
            '@radix-ui/react-slot',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-avatar',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-dialog',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-accordion'
          ]
        }
      }
    }
  }
})