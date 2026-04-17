import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
    it('renders all three sections', () => {
        const { container } = render(<App />);
        // Hero — name is split into char spans
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading.textContent?.replace(/\s+/g, ' ').trim()).toContain('Tomas Deingruber');
        // About — text is split into word spans
        const sections = container.querySelectorAll('section');
        expect(sections.length).toBeGreaterThanOrEqual(3);
        // Projects heading
        expect(screen.getByText('Projects')).toBeInTheDocument();
    });
});
