import type { FooterConfig } from '@/types/config';
import styles from './Footer.module.scss';

interface FooterProps {
    config: FooterConfig;
}

export default function Footer({ config }: FooterProps) {
    if (!config.motto) {
        return <footer className={styles.footer} />;
    }

    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <blockquote className={styles.motto}>
                    <p className={styles.quote}>&ldquo;{config.motto}&rdquo;</p>
                    {config.author && (
                        <cite className={styles.author}>&mdash; {config.author}</cite>
                    )}
                </blockquote>
            </div>
        </footer>
    );
}
