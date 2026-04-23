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
            // Exit: words fade up as section scrolls out
            gsap.to(wordInners, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 60%',
                    end: 'bottom 40%',
                    // markers: true,
                    scrub: true,
                    toggleActions: 'play complete none reverse',
                },
                keyframes: {
                    "0%": { y: 20, opacity: 0 },
                    "15%": { y: 0, opacity: 1 },
                    "85%": { y: 0, opacity: 1 },
                    "100%": { y: 20, opacity: 0 },
                    easeEach: 'sine.out',
                },
                stagger: 0.015,
                ease: 'none', // ease the entire keyframe block
                duration: 1, // total duration of the keyframe sequence (adjust as needed)
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
