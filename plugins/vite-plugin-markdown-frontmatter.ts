import matter from 'gray-matter';
import type { Plugin } from 'vite';

/**
 * Vite plugin that transforms `.md` files with YAML frontmatter
 * into JS modules exporting parsed JSON data.
 *
 * This runs at build time in Node.js — gray-matter never ships to the browser.
 */
export default function markdownFrontmatter(): Plugin {
    return {
        name: 'vite-plugin-markdown-frontmatter',
        enforce: 'pre',

        transform(src: string, id: string) {
            if (!id.endsWith('.md')) return null;

            const { data, content } = matter(src);

            const exported = {
                ...data,
                body: content.trim(),
            };

            return {
                code: `export default ${JSON.stringify(exported)};`,
                map: null,
            };
        },
    };
}
