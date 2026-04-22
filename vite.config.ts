import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    host: true,
    allowedHosts: ['tomdein.deini.eu'],
    proxy: {
      '/images': 'http://localhost:5174',
      '/content': 'http://localhost:5174',
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
