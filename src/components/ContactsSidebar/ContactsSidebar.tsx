import type { ContactsConfig } from '@/types/config';
import styles from './ContactsSidebar.module.scss';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


interface ContactsSidebarProps {
    config: ContactsConfig;
}

export default function ContactsSidebar({ config }: ContactsSidebarProps) {
    const sidebarRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const sidebar = sidebarRef.current;
            if (!sidebar) return;

            gsap.to(
                sidebar,
                {
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sidebar,
                        start: 'top 0%',
                        end: 'bottom 0%',
                        scrub: true,
                        // markers: true,
                    },
                },
            );
        },
        { scope: sidebarRef },
    );

    return (
        <aside
            className={`${styles.sidebar} ${config.side === 'left' ? styles.left : styles.right}`}
            ref={sidebarRef}
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
