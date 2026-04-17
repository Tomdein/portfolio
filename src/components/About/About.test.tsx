import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import About from './About';

describe('About', () => {
    it('renders the about text', () => {
        const { container } = render(<About />);
        const section = container.querySelector('section');
        expect(section).toBeInTheDocument();
        // Text is split into word spans by GSAP animation
        const text = section?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
        expect(text).toContain('intersection of code');
        expect(text).toContain('craft');
        expect(text).toContain('curiosity');
    });

    it('renders as a section element', () => {
        const { container } = render(<About />);
        const section = container.querySelector('section');
        expect(section).toBeInTheDocument();
    });
});
