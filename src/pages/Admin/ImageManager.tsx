import { useState, useEffect, useRef } from 'react';
import styles from './ImageManager.module.scss';

const ACCEPTED_TYPES = '.jpg,.jpeg,.png,.webp,.gif,.svg,.avif';
const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'avif']);

interface ImageManagerProps {
    credentials: { username: string; password: string } | null;
    onCredentialsNeeded: () => void;
}

interface Entry {
    name: string;
    type: 'file' | 'directory';
}

function isImage(name: string): boolean {
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    return IMAGE_EXTENSIONS.has(ext);
}

export default function ImageManager({ credentials, onCredentialsNeeded }: ImageManagerProps) {
    const [pathSegments, setPathSegments] = useState<string[]>([]);
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [renamingFile, setRenamingFile] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState('');
    const [deletingFile, setDeletingFile] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentApiPath = '/images/' + (pathSegments.length ? pathSegments.join('/') + '/' : '');

    useEffect(() => {
        loadEntries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathSegments]);

    const loadEntries = async () => {
        setLoading(true);
        setStatus(null);
        try {
            const res = await fetch(currentApiPath);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data: Array<{ name: string; type: string }> = await res.json();
            setEntries(
                data
                    .filter((f) => f.type === 'file' || f.type === 'directory')
                    .map((f) => ({ name: f.name, type: f.type as 'file' | 'directory' }))
                    .sort((a, b) => {
                        if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
                        return a.name.localeCompare(b.name);
                    }),
            );
        } catch (err) {
            setStatus({
                type: 'error',
                message: `Failed to load: ${err instanceof Error ? err.message : String(err)}`,
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

    const navigateTo = (dir: string) => {
        setEntries([]);
        setStatus(null);
        setPathSegments((prev) => [...prev, dir]);
    };

    const navigateUp = () => {
        setEntries([]);
        setStatus(null);
        setPathSegments((prev) => prev.slice(0, -1));
    };

    const navigateToBreadcrumb = (index: number) => {
        setEntries([]);
        setStatus(null);
        setPathSegments((prev) => prev.slice(0, index + 1));
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
                const res = await fetch(`${currentApiPath}${file.name}`, {
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

        await loadEntries();
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
            const res = await fetch(`${currentApiPath}${name}`, {
                method: 'DELETE',
                headers: { Authorization: getAuthHeader()! },
            });
            if (res.status === 401) {
                onCredentialsNeeded();
                return;
            }
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            setEntries((prev) => prev.filter((e) => e.name !== name));
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
            const destination = `${window.location.origin}${currentApiPath}${newName}`;
            const res = await fetch(`${currentApiPath}${oldName}`, {
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
            setEntries((prev) =>
                prev.map((e) => (e.name === oldName ? { ...e, name: newName } : e)),
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

    const dirs = entries.filter((e) => e.type === 'directory');
    const files = entries.filter((e) => e.type === 'file');

    return (
        <div className={styles.manager}>
            {/* Breadcrumb */}
            <nav className={styles.breadcrumb}>
                <button
                    className={styles.breadcrumbSegment}
                    onClick={() => setPathSegments([])}
                    disabled={pathSegments.length === 0}
                >
                    images
                </button>
                {pathSegments.map((seg, i) => (
                    <span key={i} className={styles.breadcrumbItem}>
                        <span className={styles.breadcrumbSep}>/</span>
                        <button
                            className={styles.breadcrumbSegment}
                            onClick={() => navigateToBreadcrumb(i)}
                            disabled={i === pathSegments.length - 1}
                        >
                            {seg}
                        </button>
                    </span>
                ))}
            </nav>

            {/* Drop zone */}
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
                <p className={`${styles.status} ${status.type === 'error' ? styles.error : styles.success}`}>
                    {status.message}
                </p>
            )}

            <div className={styles.toolbar}>
                {pathSegments.length > 0 && (
                    <button className={styles.btn} onClick={navigateUp}>
                        ← Up
                    </button>
                )}
                <button className={styles.btn} onClick={loadEntries} disabled={loading}>
                    {loading ? 'Loading…' : 'Refresh'}
                </button>
                <span className={styles.count}>
                    {dirs.length > 0 && `${dirs.length} folder${dirs.length !== 1 ? 's' : ''}`}
                    {dirs.length > 0 && files.length > 0 && ', '}
                    {files.length > 0 && `${files.length} file${files.length !== 1 ? 's' : ''}`}
                    {entries.length === 0 && !loading && 'Empty'}
                </span>
            </div>

            {entries.length === 0 && !loading && (
                <p className={styles.empty}>No files or folders here.</p>
            )}

            {/* Directories */}
            {dirs.length > 0 && (
                <div className={styles.dirGrid}>
                    {dirs.map((dir) => (
                        <button
                            key={dir.name}
                            className={styles.dirCell}
                            onClick={() => navigateTo(dir.name)}
                            title={`Open ${dir.name}/`}
                        >
                            <span className={styles.dirIcon}>📁</span>
                            <span className={styles.dirName}>{dir.name}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Files */}
            <div className={styles.grid}>
                {files.map((file) => (
                    <div key={file.name} className={styles.cell}>
                        <div className={styles.thumb}>
                            {isImage(file.name) ? (
                                <img
                                    src={`${currentApiPath}${file.name}`}
                                    alt={file.name}
                                    loading="lazy"
                                />
                            ) : (
                                <span className={styles.fileIcon}>📄</span>
                            )}
                        </div>

                        {renamingFile === file.name ? (
                            <div className={styles.renameRow}>
                                <input
                                    className={styles.renameInput}
                                    value={renameValue}
                                    onChange={(e) => setRenameValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleRename(file.name);
                                        if (e.key === 'Escape') cancelRename();
                                    }}
                                    autoFocus
                                />
                                <button
                                    className={styles.btnSmall}
                                    onClick={() => handleRename(file.name)}
                                    title="Confirm rename"
                                >
                                    ✓
                                </button>
                                <button
                                    className={styles.btnSmall}
                                    onClick={cancelRename}
                                    title="Cancel"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <div className={styles.infoRow}>
                                <span className={styles.filename} title={file.name}>
                                    {file.name}
                                </span>
                                <div className={styles.actions}>
                                    <button
                                        className={styles.btnSmall}
                                        onClick={() => startRename(file.name)}
                                        title="Rename"
                                    >
                                        ✎
                                    </button>
                                    <button
                                        className={`${styles.btnSmall} ${styles.btnDanger}`}
                                        onClick={() => {
                                            if (window.confirm(`Delete ${file.name}?`))
                                                handleDelete(file.name);
                                        }}
                                        disabled={deletingFile === file.name}
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
