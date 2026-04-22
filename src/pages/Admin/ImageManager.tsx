import { useState, useEffect, useRef } from 'react';
import styles from './ImageManager.module.scss';

const ACCEPTED_TYPES = '.jpg,.jpeg,.png,.webp,.gif,.svg,.avif';

interface ImageManagerProps {
    credentials: { username: string; password: string } | null;
    onCredentialsNeeded: () => void;
}

interface ImageFile {
    name: string;
}

export default function ImageManager({ credentials, onCredentialsNeeded }: ImageManagerProps) {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [renamingFile, setRenamingFile] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState('');
    const [deletingFile, setDeletingFile] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadImages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadImages = async () => {
        setLoading(true);
        setStatus(null);
        try {
            const res = await fetch('/images/');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data: Array<{ name: string; type: string }> = await res.json();
            setImages(data.filter((f) => f.type === 'file'));
        } catch (err) {
            setStatus({
                type: 'error',
                message: `Failed to load images: ${err instanceof Error ? err.message : String(err)}`,
            });
        } finally {
            setLoading(false);
        }
    };

    const getAuthHeader = () => {
        if (!credentials) return null;
        return `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`;
    };

    const requireAuth = (): boolean => {
        if (!credentials) {
            onCredentialsNeeded();
            return false;
        }
        return true;
    };

    const handleUpload = async (files: FileList) => {
        if (!requireAuth()) return;
        setUploading(true);
        setStatus(null);
        const auth = getAuthHeader()!;
        const errors: string[] = [];
        const uploaded: string[] = [];

        for (const file of Array.from(files)) {
            try {
                const res = await fetch(`/images/${file.name}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': file.type || 'application/octet-stream',
                        Authorization: auth,
                    },
                    body: file,
                });
                if (res.status === 401) {
                    onCredentialsNeeded();
                    setUploading(false);
                    return;
                }
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                uploaded.push(file.name);
            } catch (err) {
                errors.push(`${file.name}: ${err instanceof Error ? err.message : String(err)}`);
            }
        }

        await loadImages();
        setUploading(false);
        if (errors.length) {
            setStatus({ type: 'error', message: `Upload failed for: ${errors.join(', ')}` });
        } else {
            setStatus({ type: 'success', message: `Uploaded: ${uploaded.join(', ')}` });
        }
    };

    const handleDelete = async (name: string) => {
        if (!requireAuth()) return;
        setDeletingFile(name);
        setStatus(null);
        try {
            const res = await fetch(`/images/${name}`, {
                method: 'DELETE',
                headers: { Authorization: getAuthHeader()! },
            });
            if (res.status === 401) {
                onCredentialsNeeded();
                return;
            }
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            setImages((prev) => prev.filter((img) => img.name !== name));
            setStatus({ type: 'success', message: `Deleted ${name}.` });
        } catch (err) {
            setStatus({
                type: 'error',
                message: `Delete failed: ${err instanceof Error ? err.message : String(err)}`,
            });
        } finally {
            setDeletingFile(null);
        }
    };

    const startRename = (name: string) => {
        setRenamingFile(name);
        setRenameValue(name);
    };

    const cancelRename = () => {
        setRenamingFile(null);
        setRenameValue('');
    };

    const handleRename = async (oldName: string) => {
        if (!requireAuth()) return;
        const newName = renameValue.trim();
        if (!newName || newName === oldName) {
            cancelRename();
            return;
        }
        setStatus(null);
        try {
            const destination = `${window.location.origin}/images/${newName}`;
            const res = await fetch(`/images/${oldName}`, {
                method: 'MOVE',
                headers: {
                    Authorization: getAuthHeader()!,
                    Destination: destination,
                },
            });
            if (res.status === 401) {
                onCredentialsNeeded();
                return;
            }
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            setImages((prev) =>
                prev.map((img) => (img.name === oldName ? { name: newName } : img)),
            );
            setStatus({ type: 'success', message: `Renamed ${oldName} → ${newName}.` });
        } catch (err) {
            setStatus({
                type: 'error',
                message: `Rename failed: ${err instanceof Error ? err.message : String(err)}`,
            });
        } finally {
            cancelRename();
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files);
    };

    return (
        <div className={styles.manager}>
            <div
                className={styles.dropzone}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_TYPES}
                    multiple
                    className={styles.fileInput}
                    onChange={(e) => {
                        if (e.target.files?.length) {
                            handleUpload(e.target.files);
                            e.target.value = '';
                        }
                    }}
                />
                {uploading ? 'Uploading…' : 'Click or drag & drop to upload images'}
            </div>

            {status && (
                <p
                    className={`${styles.status} ${status.type === 'error' ? styles.error : styles.success}`}
                >
                    {status.message}
                </p>
            )}

            <div className={styles.toolbar}>
                <button className={styles.btn} onClick={loadImages} disabled={loading}>
                    {loading ? 'Loading…' : 'Refresh'}
                </button>
                <span className={styles.count}>
                    {images.length} image{images.length !== 1 ? 's' : ''}
                </span>
            </div>

            {images.length === 0 && !loading && (
                <p className={styles.empty}>No images found.</p>
            )}

            <div className={styles.grid}>
                {images.map((img) => (
                    <div key={img.name} className={styles.cell}>
                        <div className={styles.thumb}>
                            <img src={`/images/${img.name}`} alt={img.name} loading="lazy" />
                        </div>

                        {renamingFile === img.name ? (
                            <div className={styles.renameRow}>
                                <input
                                    className={styles.renameInput}
                                    value={renameValue}
                                    onChange={(e) => setRenameValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleRename(img.name);
                                        if (e.key === 'Escape') cancelRename();
                                    }}
                                    autoFocus
                                />
                                <button
                                    className={styles.btnSmall}
                                    onClick={() => handleRename(img.name)}
                                    title="Confirm rename"
                                >
                                    ✓
                                </button>
                                <button
                                    className={styles.btnSmall}
                                    onClick={cancelRename}
                                    title="Cancel rename"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <div className={styles.infoRow}>
                                <span className={styles.filename} title={img.name}>
                                    {img.name}
                                </span>
                                <div className={styles.actions}>
                                    <button
                                        className={styles.btnSmall}
                                        onClick={() => startRename(img.name)}
                                        title="Rename"
                                    >
                                        ✎
                                    </button>
                                    <button
                                        className={`${styles.btnSmall} ${styles.btnDanger}`}
                                        onClick={() => {
                                            if (window.confirm(`Delete ${img.name}?`))
                                                handleDelete(img.name);
                                        }}
                                        disabled={deletingFile === img.name}
                                        title="Delete"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
