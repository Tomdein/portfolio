import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.scss';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const nameRef = useRef<HTMLHeadingElement>(null);
    const taglineRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const name = nameRef.current;
        const tagline = taglineRef.current;
        if (!section || !name || !tagline) return;

        // Split name into individual characters for stagger animation
        const nameText = name.textContent ?? '';
        name.innerHTML = nameText
            .split('')
            .map((char) =>
                char === ' '
                    ? `<span class="${styles.char}">&nbsp;</span>`
                    : `<span class="${styles.char}">${char}</span>`,
            )
            .join('');

        const chars = name.querySelectorAll(`.${styles.char}`);

        // Entrance timeline
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from(chars, {
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.03,
        }).to(
            tagline,
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
            },
            '-=0.3',
        );

        // Scroll-triggered fade out with parallax drift
        gsap.to(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            },
            y: -100,
            opacity: 0,
        });

        return () => {
            tl.kill();
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    }, []);

    return (
        <section ref={sectionRef} className={styles.hero}>
            <div className={styles.content}>
                <h1 ref={nameRef} className={styles.name}>
                    Tomas Deingruber
                </h1>
                <p ref={taglineRef} className={styles.tagline}>
                    A Maker, Programmer and Mathematician
                </p>
            </div>
        </section>
    );
}
