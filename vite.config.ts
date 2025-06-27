import { defineConfig } from 'vite'
import { copyFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

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
  },
  // Copy Shoelace assets
  plugins: [
    {
      name: 'copy-shoelace-assets',
      writeBundle() {
        try {
          mkdirSync('dist/assets/icons', { recursive: true })
          // Copy some essential icons - you can expand this list as needed
          const iconsPath = 'node_modules/@shoelace-style/shoelace/dist/assets/icons'
          const essentialIcons = [
            'arrow-clockwise.svg', 'check.svg', 'check-circle.svg', 'x.svg',
            'plus.svg', 'pencil.svg', 'trash.svg', 'flag.svg', 'calendar.svg',
            'clock.svg', 'link-45deg.svg', 'three-dots.svg', 'check-square.svg',
            'square.svg', 'arrow-counterclockwise.svg', 'exclamation-triangle.svg'
          ]
          
          essentialIcons.forEach(icon => {
            try {
              copyFileSync(`${iconsPath}/${icon}`, `dist/assets/icons/${icon}`)
            } catch (e) {
              // Icon doesn't exist, skip it
              console.warn(`Icon ${icon} not found, skipping`)
            }
          })
        } catch (e) {
          console.warn('Could not copy Shoelace icons:', e)
        }
      }
    }
  ]
})
