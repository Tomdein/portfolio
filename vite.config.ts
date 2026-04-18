import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import markdownFrontmatter from './plugins/vite-plugin-markdown-frontmatter'

// https://vite.dev/config/
export default defineConfig({
  plugins: [markdownFrontmatter(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
