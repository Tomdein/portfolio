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

export default function Admin() {
    const [credentials, setCredentials] = useState<Credentials | null>(null);
    const [showCredentialsForm, setShowCredentialsForm] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState<'yaml' | 'images'>('yaml');

    const handleCredentialsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCredentials({ username, password });
        setPassword('');
        setShowCredentialsForm(false);
    };

    return (
        <div className={styles.admin}>
            <header className={styles.header}>
                <h1 className={styles.title}>Content Admin</h1>
                <div className={styles.auth}>
                    {credentials ? (
                        <span className={styles.authStatus}>
                            Signed in as <strong>{credentials.username}</strong>
                            <button
                                className={styles.signOut}
                                onClick={() => setCredentials(null)}
                            >
                                Sign out
                            </button>
                        </span>
                    ) : (
                        <button
                            className={styles.btn}
                            onClick={() => setShowCredentialsForm(true)}
                        >
                            Set credentials
                        </button>
                    )}
                </div>
            </header>

            {showCredentialsForm && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <h2 className={styles.modalTitle}>Admin credentials</h2>
                        <form onSubmit={handleCredentialsSubmit} className={styles.form}>
                            <label className={styles.label}>
                                Username
                                <input
                                    className={styles.input}
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoComplete="username"
                                    required
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
                                />
                            </label>
                            <div className={styles.formActions}>
                                <button
                                    type="button"
                                    className={styles.btn}
                                    onClick={() => setShowCredentialsForm(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className={styles.btnPrimary}>
                                    Confirm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                                onCredentialsNeeded={() => setShowCredentialsForm(true)}
                            />
                        ))}
                    </div>
                )}

                {activeTab === 'images' && (
                    <ImageManager
                        credentials={credentials}
                        onCredentialsNeeded={() => setShowCredentialsForm(true)}
                    />
                )}
            </main>
        </div>
    );
}
