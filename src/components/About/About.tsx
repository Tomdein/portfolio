import { useRef, useLayoutEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { AboutConfig } from '@/types/config';
import { mdToHtml, wrapTextWords } from '@/utils/markdown';
import styles from './About.module.scss';

gsap.registerPlugin(ScrollTrigger);

interface AboutProps {
    config: AboutConfig;
}

export default function About({ config }: AboutProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    // Inject markdown HTML then wrap each word in animated spans.
    // Declared before useGSAP so it runs first (both are layout effects).
    useLayoutEffect(() => {
        const container = textRef.current;
        if (!container) return;
        container.innerHTML = mdToHtml(config.text);
        wrapTextWords(container, styles.word, styles.wordInner);
    }, [config.text]);

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
            {/* Children omitted intentionally — innerHTML managed by useLayoutEffect above */}
            <div ref={textRef} className={styles.text} />
        </section>
    );
}
