import yaml from 'js-yaml';
import type {
    AllConfig,
    HeroConfig,
    AboutConfig,
    ProjectsConfig,
    TaglineConfig,
    ContactsConfig,
    FooterConfig,
    SiteConfig,
} from '@/types/config';

async function fetchYaml<T>(path: string): Promise<T> {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.statusText}`);
    const text = await res.text();
    return yaml.load(text) as T;
}

export async function loadAllConfigs(): Promise<AllConfig> {
    const [hero, about, projects, tagline, contacts, footer, site] = await Promise.all([
        fetchYaml<HeroConfig>('/content/hero.yaml'),
        fetchYaml<AboutConfig>('/content/about.yaml'),
        fetchYaml<ProjectsConfig>('/content/projects.yaml'),
        fetchYaml<TaglineConfig>('/content/tagline.yaml'),
        fetchYaml<ContactsConfig>('/content/contacts.yaml'),
        fetchYaml<FooterConfig>('/content/footer.yaml'),
        fetchYaml<SiteConfig>('/content/site.yaml'),
    ]);
    return { hero, about, projects, tagline, contacts, footer, site };
}

export function preloadImages(urls: string[]): Promise<void[]> {
    return Promise.all(
        urls.map(
            (url) =>
                new Promise<void>((resolve) => {
                    const img = new Image();
                    img.onload = () => resolve();
                    img.onerror = () => resolve();
                    img.src = url;
                }),
        ),
    );
}
