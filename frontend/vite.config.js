// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:5000',   // ← muito importante usar 127.0.0.1 em vez de localhost
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path            // mantém /api no caminho
    }
  }
}
})