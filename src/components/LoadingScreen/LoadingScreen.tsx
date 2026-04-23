import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import type { HeroConfig } from '@/types/config';
import styles from './LoadingScreen.module.scss';

interface LoadingScreenProps {
    hero: HeroConfig;
    imagesLoaded: boolean;
    onExit: () => void;
}

export default function LoadingScreen({ hero, imagesLoaded, onExit }: LoadingScreenProps) {
    const screenRef = useRef<HTMLDivElement>(null);
    const [minTimePassed, setMinTimePassed] = useState(false);
    const exitingRef = useRef(false);

    useEffect(() => {
        const timer = setTimeout(() => setMinTimePassed(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!imagesLoaded || !minTimePassed || exitingRef.current) return;
        exitingRef.current = true;

        const screen = screenRef.current;
        if (!screen) {
            onExit();
            return;
        }

        gsap.to(screen, {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: onExit,
        });
    }, [imagesLoaded, minTimePassed, onExit]);

    const name = `${hero.title} ${hero.firstName} ${hero.lastName}`;

    return (
        <div ref={screenRef} className={styles.screen}>
            <div className={styles.content}>
                <p className={styles.name}>{name}</p>
                <div className={styles.throbber}>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                </div>
            </div>
        </div>
    );
}
