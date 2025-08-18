import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/previewer/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        iframe: 'iframe.html'
      }
    }
  },
  server: {
    host: true, // Allow external connections for iframe testing
  }
})
