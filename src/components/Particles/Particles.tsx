import { useEffect, useRef } from 'react';
import styles from './Particles.module.scss';

interface ParticlesProps {
    show: boolean;
}

export default function Particles({ show }: ParticlesProps) {
    const containerRef = useRef<HTMLCanvasElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const instanceRef = useRef<any>(null);
    const initializedRef = useRef(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || initializedRef.current) return;
        initializedRef.current = true;

        import('canvasparticles-js').then(({ default: CanvasParticles }) => {
            container.id = 'particles-bg';
            instanceRef.current = new CanvasParticles('#particles-bg', {
                background: 'transparent',
                particles: {
                    color: '#646cff',
                    ppm: 25,
                    connectDistance: 120,
                    max: 80,
                },
                mouse: {
                    interactionType: 0,
                },
            });
            if (show) {
                instanceRef.current.start();
            }
        });

        return () => {
            if (instanceRef.current) {
                instanceRef.current.destroy();
                instanceRef.current = null;
            }
            initializedRef.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!instanceRef.current) return;
        if (show) {
            instanceRef.current.start();
        } else {
            instanceRef.current.stop({ clear: false });
        }
    }, [show]);

    return <canvas ref={containerRef} className={styles.container} />;
}
