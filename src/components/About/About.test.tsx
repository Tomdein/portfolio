import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import About from './About';
import type { AboutConfig } from '@/types/config';

const mockAbout: AboutConfig = {
    text: 'I build things at the intersection of code, craft, and curiosity.',
};

describe('About', () => {
    it('renders the about text', () => {
        const { container } = render(<About config={mockAbout} />);
        const section = container.querySelector('section');
        expect(section).toBeInTheDocument();
        const text = section?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
        expect(text).toContain('intersection of code');
    });

    it('renders as a section element', () => {
        const { container } = render(<About config={mockAbout} />);
        const section = container.querySelector('section');
        expect(section).toBeInTheDocument();
    });
});
