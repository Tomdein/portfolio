import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Hero from './Hero';
import type { HeroConfig } from '@/types/config';

const mockHero: HeroConfig = {
    title: 'Ing.',
    firstName: 'Tomas',
    lastName: 'Deingruber',
    infoLine: 'Ing. — MSc Computer Science',
};

describe('Hero', () => {
    it('renders the name heading', () => {
        render(<Hero config={mockHero} infoLineReady={false} />);
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
    });

    it('renders the infoLine', () => {
        render(<Hero config={mockHero} infoLineReady={false} />);
        const info = screen.getByText('Ing. — MSc Computer Science');
        expect(info).toBeInTheDocument();
    });

    it('renders as a section element', () => {
        const { container } = render(<Hero config={mockHero} infoLineReady={false} />);
        const section = container.querySelector('section');
        expect(section).toBeInTheDocument();
    });
});
