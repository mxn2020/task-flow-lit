import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    host: true,
    open: false
  },
  build: {
    // Ensure proper handling of dynamic imports and code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['lit', '@shoelace-style/shoelace'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  },
  // Configure how imports are resolved
  resolve: {
    alias: {
      // Add any path aliases if needed
    }
  },
  // Ensure proper MIME types for ES modules
  optimizeDeps: {
    include: ['lit', '@shoelace-style/shoelace', '@supabase/supabase-js']
  }
})
