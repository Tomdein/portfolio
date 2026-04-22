import { useState } from 'react';
import YamlEditor from './YamlEditor';
import ImageManager from './ImageManager';
import styles from './Admin.module.scss';

const YAML_FILES = [
    'hero.yaml',
    'about.yaml',
    'projects.yaml',
    'tagline.yaml',
    'contacts.yaml',
    'footer.yaml',
    'site.yaml',
] as const;

interface Credentials {
    username: string;
    password: string;
}

type Phase = 'login' | 'verifying' | 'authenticated' | 'denied';

async function verifyCredentials(username: string, password: string): Promise<boolean> {
    const auth = `Basic ${btoa(`${username}:${password}`)}`;
    try {
        const res = await fetch('/images/__auth_check__', {
            method: 'DELETE',
            headers: { Authorization: auth },
        });
        return res.status !== 401;
    } catch {
        return false;
    }
}

export default function Admin() {
    const [phase, setPhase] = useState<Phase>('login');
    const [credentials, setCredentials] = useState<Credentials | null>(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState<'yaml' | 'images'>('yaml');

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPhase('verifying');
        const valid = await verifyCredentials(username, password);
        if (valid) {
            setCredentials({ username, password });
            setUsername('');
            setPassword('');
            setPhase('authenticated');
        } else {
            setUsername('');
            setPassword('');
            setPhase('denied');
        }
    };

    if (phase === 'login' || phase === 'verifying') {
        return (
            <div className={styles.loginPage}>
                <div className={styles.modal}>
                    <h2 className={styles.modalTitle}>Admin</h2>
                    <form onSubmit={handleLoginSubmit} className={styles.form}>
                        <label className={styles.label}>
                            Username
                            <input
                                className={styles.input}
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                required
                                disabled={phase === 'verifying'}
                            />
                        </label>
                        <label className={styles.label}>
                            Password
                            <input
                                className={styles.input}
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                                disabled={phase === 'verifying'}
                            />
                        </label>
                        <div className={styles.formActions}>
                            <button
                                type="submit"
                                className={styles.btnPrimary}
                                disabled={phase === 'verifying'}
                            >
                                {phase === 'verifying' ? 'Verifying…' : 'Sign in'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    if (phase === 'denied') {
        return null;
    }

    return (
        <div className={styles.admin}>
            <header className={styles.header}>
                <h1 className={styles.title}>Content Admin</h1>
                <div className={styles.auth}>
                    <span className={styles.authStatus}>
                        Signed in as <strong>{credentials!.username}</strong>
                        <button
                            className={styles.signOut}
                            onClick={() => {
                                setCredentials(null);
                                setPhase('login');
                            }}
                        >
                            Sign out
                        </button>
                    </span>
                </div>
            </header>

            <main className={styles.main}>
                <nav className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'yaml' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('yaml')}
                    >
                        YAML Editor
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'images' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('images')}
                    >
                        Image Manager
                    </button>
                </nav>

                {activeTab === 'yaml' && (
                    <div className={styles.grid}>
                        {YAML_FILES.map((filename) => (
                            <YamlEditor
                                key={filename}
                                filename={filename}
                                credentials={credentials}
                                onCredentialsNeeded={() => setPhase('login')}
                            />
                        ))}
                    </div>
                )}

                {activeTab === 'images' && (
                    <ImageManager
                        credentials={credentials}
                        onCredentialsNeeded={() => setPhase('login')}
                    />
                )}
            </main>
        </div>
    );
}
