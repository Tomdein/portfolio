import styles from './ParticleToggle.module.scss';

interface ParticleToggleProps {
    enabled: boolean;
    onToggle: () => void;
}

export default function ParticleToggle({ enabled, onToggle }: ParticleToggleProps) {
    return (
        <button
            className={`${styles.toggle} ${enabled ? styles.on : styles.off}`}
            onClick={onToggle}
            aria-label={enabled ? 'Disable particles' : 'Enable particles'}
            title={enabled ? 'Particles on' : 'Particles off'}
        >
            <span className={styles.icon} aria-hidden="true">
                ✦
            </span>
        </button>
    );
}
