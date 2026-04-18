import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import type { AllConfig } from '@/types/config';

const mockConfig: AllConfig = {
    hero: { title: 'Ing.', firstName: 'Tomas', lastName: 'Deingruber', infoLine: 'Ing. — MSc Computer Science' },
    about: { text: 'Test about text.' },
    projects: { projects: [] },
    tagline: { text: 'Test tagline', backgroundImage: '/test.webp' },
    contacts: { side: 'right', items: [] },
    footer: { motto: 'Test motto', author: 'Author' },
    site: { enableLoadingScreen: false, enableLoadingParticles: false, enableBackgroundParticles: false },
};

beforeEach(() => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        text: async () => '',
    } as Response);
    vi.mock('@/utils/loadConfig', () => ({
        loadAllConfigs: async () => mockConfig,
        preloadImages: async () => [],
    }));
});

describe('App', () => {
    it('renders without crashing', () => {
        const { container } = render(<App />);
        expect(container).toBeInTheDocument();
    });
});
