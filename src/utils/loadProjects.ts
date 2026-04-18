import type { Project } from '@/types/project';

interface MarkdownData {
    title?: string;
    description?: string;
    tags?: string[];
    image?: string;
    link?: string;
    order?: number;
    body?: string;
}

// Vite plugin pre-parses .md files at build time — no Node.js code in browser
const projectFiles = import.meta.glob<MarkdownData>('/content/projects/*.md', {
    eager: true,
    import: 'default',
});

export function loadProjects(): Project[] {
    const projects: Project[] = [];

    for (const [, data] of Object.entries(projectFiles)) {
        if (!data.title || !data.description || !data.tags || !data.image || data.order == null) {
            console.warn('Skipping project with missing required fields:', data.title ?? 'untitled');
            continue;
        }

        projects.push({
            title: data.title,
            description: data.description,
            tags: data.tags,
            image: data.image,
            link: data.link ?? undefined,
            order: data.order,
            body: data.body ?? '',
        });
    }

    return projects.sort((a, b) => a.order - b.order);
}
