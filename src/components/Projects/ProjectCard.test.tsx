import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProjectCard from './ProjectCard';
import type { Project } from '@/types/project';

const mockProject: Project = {
    title: 'Test Project',
    description: 'A test project description',
    tags: ['React', 'TypeScript'],
    image: '/images/projects/test.webp',
    link: 'https://example.com',
    order: 1,
    body: '',
};

describe('ProjectCard', () => {
    it('renders the project title as a link when link is provided', () => {
        render(<ProjectCard project={mockProject} index={0} />);
        const link = screen.getByRole('link', { name: /Test Project/i });
        expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('renders the project title without a link when link is absent', () => {
        const noLinkProject = { ...mockProject, link: undefined };
        render(<ProjectCard project={noLinkProject} index={0} />);
        expect(screen.getByText('Test Project')).toBeInTheDocument();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('renders the description', () => {
        render(<ProjectCard project={mockProject} index={0} />);
        expect(screen.getByText('A test project description')).toBeInTheDocument();
    });

    it('renders all tags', () => {
        render(<ProjectCard project={mockProject} index={0} />);
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('renders the project image', () => {
        render(<ProjectCard project={mockProject} index={0} />);
        const img = screen.getByAltText('Test Project');
        expect(img).toHaveAttribute('src', '/images/projects/test.webp');
    });
});
