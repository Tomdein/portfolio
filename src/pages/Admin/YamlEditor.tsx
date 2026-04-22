import { useState, useEffect } from 'react';
import styles from './YamlEditor.module.scss';

interface YamlEditorProps {
    filename: string;
    credentials: { username: string; password: string } | null;
    onCredentialsNeeded: () => void;
}

export default function YamlEditor({ filename, credentials, onCredentialsNeeded }: YamlEditorProps) {
    const [content, setContent] = useState<string>('');
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const load = async () => {
        setLoading(true);
        setStatus(null);
        try {
            const res = await fetch(`/content/${filename}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = await res.text();
            setContent(text);
            setLoaded(true);
        } catch (err) {
            setStatus({ type: 'error', message: `Load failed: ${err instanceof Error ? err.message : String(err)}` });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const save = async () => {
        if (!credentials) {
            onCredentialsNeeded();
            return;
        }
        setSaving(true);
        setStatus(null);
        try {
            const authHeader = `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`;
            const res = await fetch(`/content/${filename}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-yaml',
                    Authorization: authHeader,
                },
                body: content,
            });
            if (res.status === 401) {
                onCredentialsNeeded();
                setStatus({ type: 'error', message: 'Authentication failed — please re-enter credentials.' });
                return;
            }
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            setStatus({ type: 'success', message: 'Saved successfully.' });
        } catch (err) {
            setStatus({ type: 'error', message: `Save failed: ${err instanceof Error ? err.message : String(err)}` });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.editor}>
            <div className={styles.header}>
                <h3 className={styles.filename}>{filename}</h3>
                <div className={styles.actions}>
                    <button className={styles.btn} onClick={load} disabled={loading}>
                        {loading ? 'Loading…' : 'Reload'}
                    </button>
                    {loaded && (
                        <button className={styles.btnPrimary} onClick={save} disabled={saving}>
                            {saving ? 'Saving…' : 'Save'}
                        </button>
                    )}
                </div>
            </div>
            {loaded && (
                <textarea
                    className={styles.textarea}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    spellCheck={false}
                    rows={12}
                />
            )}
            {status && (
                <p className={`${styles.status} ${status.type === 'error' ? styles.error : styles.success}`}>
                    {status.message}
                </p>
            )}
        </div>
    );
}
