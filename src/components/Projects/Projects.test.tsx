import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Projects from './Projects';

describe('Projects', () => {
    it('renders the section heading', () => {
        render(<Projects />);
        expect(screen.getByText('Projects')).toBeInTheDocument();
    });

    it('renders project cards from content files', () => {
        render(<Projects />);
        // Sample project data from content/projects/
        expect(screen.getByText('Portfolio Website')).toBeInTheDocument();
        expect(screen.getByText('Sample Project')).toBeInTheDocument();
    });
});
