import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { AboutConfig } from '@/types/config';
import styles from './About.module.scss';

gsap.registerPlugin(ScrollTrigger);

interface AboutProps {
    config: AboutConfig;
}

export default function About({ config }: AboutProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const words = config.text.split(' ');

    useGSAP(
        () => {
            const section = sectionRef.current;
            if (!section) return;

            const wordInners = section.querySelectorAll(`.${styles.wordInner}`);

            // Entrance: words reveal on scroll
            gsap.from(wordInners, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                    end: 'top -10%',
                    scrub: true,
                },
                y: 20,
                opacity: 0,
                stagger: 0.02,
            });

            // Exit: words fade up as section scrolls out
            gsap.to(wordInners, {
                scrollTrigger: {
                    trigger: section,
                    start: 'bottom 70%',
                    end: 'bottom 10%',
                    scrub: true,
                },
                y: -20,
                opacity: 0,
                stagger: 0.01,
            });
        },
        { scope: sectionRef, dependencies: [config.text] },
    );

    return (
        <section ref={sectionRef} className={styles.about}>
            <p className={styles.text}>
                {words.map((word, i) => (
                    <span key={i} className={styles.word}>
                        <span className={styles.wordInner}>{word}</span>
                        {i < words.length - 1 ? ' ' : ''}
                    </span>
                ))}
            </p>
        </section>
    );
}
