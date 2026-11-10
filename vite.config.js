import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Mode for production
  mode: 'production',
  // Base path optimization
  base: '/',
  // Server configuration
  server: {
    host: true,
    open: true,
    strictPort: 3000,
  },
  // Build optimization
  build: {
    // Use esbuild for faster builds
    esbuild: {
      jsx: true,
      drop: ['console', 'debugger'],
    },
    // Output directory
    outDir: 'dist',
    // Empty dist before build
    emptyOutDir: true,
    // Source maps disabled for production
    sourcemap: false,
    // Report files smaller than threshold
    reportCompressedSize: false,
    // Chunk size warning
    chunkSizeWarningLimit: 1000,
    // Rollup options for optimization
    rollupOptions: {
      output: {
        // Manual chunking for smaller bundles
        manualChunks(id) {
          // React and related libraries
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react'
          }
          // Three.js is large, split it out
          if (id.includes('node_modules/three')) {
            return 'three'
          }
          // Framer Motion
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion'
          }
          // Lucide React (icons)
          if (id.includes('node_modules/lucide-react')) {
            return 'icons'
          }
          // Firebase
          if (id.includes('node_modules/firebase')) {
            return 'firebase'
          }
          // React Router
          if (id.includes('node_modules/react-router-dom')) {
            return 'router'
          }
        },
      },
    },
    // CSS code splitting
    cssCodeSplit: true,
    // Module and asset IDs are deterministic
    moduleIds: 'deterministic',
  },
  // Optimization for dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'three'],
  },
})