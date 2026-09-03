import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

/**
 * vite.classic.config.ts
 * ─────────────────────────────────────────────
 * Serves the ORIGINAL (classic) Mannat Arts homepage.
 * Run with:  npm run dev:classic
 * Accessible at: http://localhost:8444
 */
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: './index.classic.html',
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8444,
    strictPort: true,
  },
})
