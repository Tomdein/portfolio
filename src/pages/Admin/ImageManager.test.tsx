import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ImageManager from './ImageManager';

const mockCredentials = { username: 'admin', password: 'secret' };

const mockImages = [
    { name: 'photo.jpg', type: 'file', mtime: '2025-01-01T00:00:00', size: 12345 },
    { name: 'banner.webp', type: 'file', mtime: '2025-01-02T00:00:00', size: 9876 },
    { name: 'subdir', type: 'directory', mtime: '2025-01-01T00:00:00', size: 0 },
];

beforeEach(() => {
    vi.restoreAllMocks();
});

describe('ImageManager', () => {
    it('renders the upload dropzone', () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response(JSON.stringify([]), { status: 200 }),
        );
        render(
            <ImageManager credentials={mockCredentials} onCredentialsNeeded={() => { }} />,
        );
        expect(
            screen.getByText(/click or drag & drop to upload images/i),
        ).toBeInTheDocument();
    });

    it('displays image filenames after loading', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response(JSON.stringify(mockImages), { status: 200 }),
        );
        render(
            <ImageManager credentials={mockCredentials} onCredentialsNeeded={() => { }} />,
        );
        await waitFor(() => {
            expect(screen.getByTitle('photo.jpg')).toBeInTheDocument();
            expect(screen.getByTitle('banner.webp')).toBeInTheDocument();
        });
    });

    it('filters out directory entries from the grid', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response(JSON.stringify(mockImages), { status: 200 }),
        );
        render(
            <ImageManager credentials={mockCredentials} onCredentialsNeeded={() => { }} />,
        );
        await waitFor(() => {
            expect(screen.queryByTitle('subdir')).not.toBeInTheDocument();
        });
    });

    it('shows empty state when no images are returned', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response(JSON.stringify([]), { status: 200 }),
        );
        render(
            <ImageManager credentials={mockCredentials} onCredentialsNeeded={() => { }} />,
        );
        await waitFor(() => {
            expect(screen.getByText(/no images found/i)).toBeInTheDocument();
        });
    });

    it('calls onCredentialsNeeded when no credentials are set and upload is triggered', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response(JSON.stringify([]), { status: 200 }),
        );
        const onCredentialsNeeded = vi.fn();
        render(<ImageManager credentials={null} onCredentialsNeeded={onCredentialsNeeded} />);

        // Simulate clicking the dropzone's hidden input via the upload handler
        // We call the internal handleUpload path by dispatching a change event
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        expect(input).toBeInTheDocument();

        // Trigger a file change with a mock file
        const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
        Object.defineProperty(input, 'files', { value: { 0: file, length: 1, item: () => file } });
        input.dispatchEvent(new Event('change', { bubbles: true }));

        await waitFor(() => {
            expect(onCredentialsNeeded).toHaveBeenCalled();
        });
    });

    it('shows an error when image listing fails', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('Not Found', { status: 404 }),
        );
        render(
            <ImageManager credentials={mockCredentials} onCredentialsNeeded={() => { }} />,
        );
        await waitFor(() => {
            expect(screen.getByText(/failed to load images/i)).toBeInTheDocument();
        });
    });
});
