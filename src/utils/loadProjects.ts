import matter from 'gray-matter';
import type { Project } from '@/types/project';

const projectFiles = import.meta.glob('/content/projects/*.md', {
    query: '?raw',
    eager: true,
    import: 'default',
});

export function loadProjects(): Project[] {
    const projects: Project[] = [];

    for (const [, raw] of Object.entries(projectFiles)) {
        const { data, content } = matter(raw as string);

        if (!data.title || !data.description || !data.tags || !data.image || data.order == null) {
            console.warn('Skipping project with missing required fields:', data.title ?? 'untitled');
            continue;
        }

        projects.push({
            title: data.title as string,
            description: data.description as string,
            tags: data.tags as string[],
            image: data.image as string,
            link: (data.link as string) ?? undefined,
            order: data.order as number,
            body: content.trim(),
        });
    }

    return projects.sort((a, b) => a.order - b.order);
}
