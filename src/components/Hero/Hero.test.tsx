import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Hero from './Hero';

describe('Hero', () => {
    it('renders the name heading', () => {
        render(<Hero />);
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
        // Text is split into individual char spans by GSAP animation
        expect(heading.textContent?.replace(/\s+/g, ' ').trim()).toContain('Tomas Deingruber');
    });

    it('renders the tagline', () => {
        render(<Hero />);
        // Tagline may have opacity 0 due to GSAP but should be in DOM
        const tagline = screen.getByText('A Maker, Programmer and Mathematician');
        expect(tagline).toBeInTheDocument();
    });

    it('renders as a section element', () => {
        const { container } = render(<Hero />);
        const section = container.querySelector('section');
        expect(section).toBeInTheDocument();
    });
});
