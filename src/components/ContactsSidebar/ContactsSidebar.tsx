import type { ContactsConfig } from '@/types/config';
import styles from './ContactsSidebar.module.scss';

interface ContactsSidebarProps {
    config: ContactsConfig;
}

export default function ContactsSidebar({ config }: ContactsSidebarProps) {
    return (
        <aside
            className={`${styles.sidebar} ${config.side === 'left' ? styles.left : styles.right}`}
        >
            <ul className={styles.list}>
                {config.items.map((item) =>
                    item.url ? (
                        <li key={item.label} className={styles.item}>
                            <a
                                href={item.url}
                                className={styles.link}
                                target={item.url.startsWith('mailto:') ? undefined : '_blank'}
                                rel={
                                    item.url.startsWith('mailto:')
                                        ? undefined
                                        : 'noopener noreferrer'
                                }
                            >
                                {item.label}
                            </a>
                        </li>
                    ) : (
                        <li key={item.label} className={`${styles.item} ${styles.plain}`}>
                            {item.label}
                        </li>
                    ),
                )}
            </ul>
        </aside>
    );
}
