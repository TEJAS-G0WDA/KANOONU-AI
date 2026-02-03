import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: false, // Allow fallback to next available port if 3000 is busy
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    }
  }
})

