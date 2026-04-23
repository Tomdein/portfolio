import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Projects from './Projects';
import type { ProjectsConfig } from '@/types/config';

const mockProjects: ProjectsConfig = {
    projects: [
        {
            title: 'Test Project',
            description: 'A test description',
            tags: ['React'],
            image: '/images/test.webp',
            order: 1,
        },
    ],
};

describe('Projects', () => {
    it('renders the section heading', () => {
        render(<Projects config={mockProjects} />);
        expect(screen.getByText('Projects')).toBeInTheDocument();
    });

    it('renders project cards', () => {
        render(<Projects config={mockProjects} />);
        expect(screen.getByText('Test Project')).toBeInTheDocument();
    });
});
