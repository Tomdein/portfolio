import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './About.module.scss';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const text = textRef.current;
        if (!section || !text) return;

        // Split text into words for stagger reveal
        const original = text.textContent ?? '';
        text.innerHTML = original
            .split(' ')
            .map((word) => `<span class="${styles.word}"><span class="${styles.wordInner}">${word}</span></span>`)
            .join(' ');

        const wordInners = text.querySelectorAll(`.${styles.wordInner}`);

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

        return () => {
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    }, []);

    return (
        <section ref={sectionRef} className={styles.about}>
            <p ref={textRef} className={styles.text}>
                I build things that live at the intersection of code, craft, and curiosity.
                From embedded systems to web platforms, I enjoy turning complex problems into
                elegant solutions. When I&apos;m not programming, you&apos;ll find me exploring
                mathematics or tinkering with hardware.
            </p>
        </section>
    );
}
