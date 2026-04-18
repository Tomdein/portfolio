/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import markdownFrontmatter from './plugins/vite-plugin-markdown-frontmatter'

export default defineConfig({
    plugins: [markdownFrontmatter(), react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        css: {
            modules: {
                classNameStrategy: 'non-scoped',
            },
        },
    },
})
