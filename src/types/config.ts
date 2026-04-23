export interface HeroConfig {
    title: string;
    firstName: string;
    lastName: string;
    infoLine: string;
}

export interface AboutConfig {
    text: string;
}

export interface ProjectItem {
    title: string;
    description: string;
    tags: string[];
    image: string;
    link?: string;
    order: number;
}

export interface ProjectsConfig {
    projects: ProjectItem[];
}

export interface TaglineConfig {
    text: string;
    backgroundImage: string;
}

export interface ContactItem {
    label: string;
    url?: string;
}

export interface ContactsConfig {
    side: 'left' | 'right';
    items: ContactItem[];
}

export interface FooterConfig {
    motto?: string;
    author?: string;
}

export interface SiteConfig {
    enableLoadingScreen: boolean;
    enableLoadingParticles: boolean;
    enableBackgroundParticles: boolean;
}

export interface AllConfig {
    hero: HeroConfig;
    about: AboutConfig;
    projects: ProjectsConfig;
    tagline: TaglineConfig;
    contacts: ContactsConfig;
    footer: FooterConfig;
    site: SiteConfig;
}
