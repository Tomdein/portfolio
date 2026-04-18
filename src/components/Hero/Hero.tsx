import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prepareWithSegments, measureLineStats } from '@chenglou/pretext';
import type { HeroConfig } from '@/types/config';
import styles from './Hero.module.scss';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
    config: HeroConfig;
    infoLineReady: boolean;
}

interface NameLayout {
    lines: string[];
    fontSize: number;
}

const MIN_FONT_SIZE = 16;
const STEP_SIZE = 2;

function measureFits(text: string, fontSize: number, maxWidth: number): boolean {
    const prepared = prepareWithSegments(text, `800 ${fontSize}px Inter`);
    const { lineCount } = measureLineStats(prepared, maxWidth);
    return lineCount === 1;
}

function computeNameLayout(
    title: string,
    firstName: string,
    lastName: string,
    maxWidth: number,
): NameLayout {
    const startSize = Math.min(112, Math.max(MIN_FONT_SIZE, window.innerWidth * 0.08));
    let fontSize = startSize;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const fullText = `${title} ${firstName} ${lastName}`;
        if (measureFits(fullText, fontSize, maxWidth)) {
            return { lines: [fullText], fontSize };
        }

        const line1 = `${title} ${firstName}`;
        const line2 = lastName;
        if (measureFits(line1, fontSize, maxWidth) && measureFits(line2, fontSize, maxWidth)) {
            return { lines: [line1, line2], fontSize };
        }

        if (
            measureFits(title, fontSize, maxWidth) &&
            measureFits(firstName, fontSize, maxWidth) &&
            measureFits(lastName, fontSize, maxWidth)
        ) {
            return { lines: [title, firstName, lastName], fontSize };
        }

        if (fontSize <= MIN_FONT_SIZE) {
            return { lines: [title, firstName, lastName], fontSize: MIN_FONT_SIZE };
        }
        fontSize = Math.max(fontSize - STEP_SIZE, MIN_FONT_SIZE);
    }
}

export default function Hero({ config, infoLineReady }: HeroProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const infoLineRef = useRef<HTMLParagraphElement>(null);
    const [nameLayout, setNameLayout] = useState<NameLayout | null>(null);
    const entranceAnimatedRef = useRef(false);
    const infoLineAnimatedRef = useRef(false);

    // Compute responsive name layout on mount and resize
    useEffect(() => {
        const compute = () => {
            const container = containerRef.current;
            if (!container) return;
            const width = container.clientWidth;
            if (width === 0) return;
            const layout = computeNameLayout(
                config.title,
                config.firstName,
                config.lastName,
                width,
            );
            setNameLayout(layout);
        };

        if (document.fonts?.ready) {
            document.fonts.ready.then(compute);
        } else {
            compute();
        }

        const ro =
            typeof ResizeObserver !== 'undefined' ? new ResizeObserver(compute) : null;
        if (ro && containerRef.current) ro.observe(containerRef.current);
        return () => ro?.disconnect();
    }, [config]);

    // Entrance animation — runs once when nameLayout is first set
    useGSAP(
        () => {
            if (!nameLayout || entranceAnimatedRef.current) return;
            entranceAnimatedRef.current = true;

            const chars = containerRef.current?.querySelectorAll(`.${styles.char}`);
            if (!chars?.length) return;

            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.from(chars, { y: 60, opacity: 0, duration: 0.8, stagger: 0.03 });

            if (infoLineReady && !infoLineAnimatedRef.current) {
                infoLineAnimatedRef.current = true;
                tl.to(infoLineRef.current, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3');
            }
        },
        { scope: containerRef, dependencies: [nameLayout] },
    );

    // InfoLine late reveal — for disabled loading screen case (images finish loading after mount)
    useGSAP(
        () => {
            if (
                !infoLineReady ||
                infoLineAnimatedRef.current ||
                !entranceAnimatedRef.current ||
                !infoLineRef.current
            )
                return;
            infoLineAnimatedRef.current = true;
            gsap.to(infoLineRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
        },
        { dependencies: [infoLineReady] },
    );

    // Scroll-triggered fade out with parallax drift
    useGSAP(
        () => {
            const section = sectionRef.current;
            if (!section) return;
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
        },
        { scope: sectionRef },
    );

    return (
        <section ref={sectionRef} className={styles.hero}>
            <div ref={containerRef} className={styles.content}>
                <h1
                    className={styles.name}
                    style={nameLayout ? { fontSize: `${nameLayout.fontSize}px` } : undefined}
                >
                    {nameLayout?.lines.map((line, i) => (
                        <span key={i} className={styles.nameLine}>
                            {line.split('').map((char, j) => (
                                <span key={j} className={styles.char}>
                                    {char === ' ' ? '\u00A0' : char}
                                </span>
                            ))}
                        </span>
                    ))}
                </h1>
                <p ref={infoLineRef} className={styles.infoLine}>
                    {config.infoLine}
                </p>
            </div>
        </section>
    );
}
