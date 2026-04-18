import type { FooterConfig } from '@/types/config';
import { mdToHtml, mdToInlineHtml } from '@/utils/markdown';
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
                    <div
                        className={styles.quote}
                        dangerouslySetInnerHTML={{ __html: mdToHtml(config.motto) }}
                    />
                    {config.author && (
                        <cite
                            className={styles.author}
                            dangerouslySetInnerHTML={{
                                __html: `\u2014 ${mdToInlineHtml(config.author)}`,
                            }}
                        />
                    )}
                </blockquote>
            </div>
        </footer>
    );
}
