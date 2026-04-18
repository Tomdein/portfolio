import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { TaglineConfig } from '@/types/config';
import { mdToHtml } from '@/utils/markdown';
import styles from './Tagline.module.scss';

gsap.registerPlugin(ScrollTrigger);

interface TaglineProps {
    config: TaglineConfig;
}

export default function Tagline({ config }: TaglineProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const section = sectionRef.current;
            const image = imageRef.current;
            const text = textRef.current;
            if (!section || !image || !text) return;

            // Parallax on background image
            gsap.to(image, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
                yPercent: 20,
                ease: 'none',
            });

            // Text animate in
            gsap.from(text, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'top 30%',
                    scrub: true,
                },
                y: 40,
                opacity: 0,
            });

            // Text animate out
            gsap.to(text, {
                scrollTrigger: {
                    trigger: section,
                    start: 'bottom 60%',
                    end: 'bottom 10%',
                    scrub: true,
                },
                y: -40,
                opacity: 0,
            });
        },
        { scope: sectionRef },
    );

    return (
        <section ref={sectionRef} className={styles.tagline}>
            <div ref={imageRef} className={styles.imageWrapper}>
                <img src={config.backgroundImage} alt="" className={styles.image} />
            </div>
            <div
                ref={textRef}
                className={styles.text}
                dangerouslySetInnerHTML={{ __html: mdToHtml(config.text) }}
            />
        </section>
    );
}
