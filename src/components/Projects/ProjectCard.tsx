import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Project } from '@/types/project';
import styles from './ProjectCard.module.scss';

gsap.registerPlugin(ScrollTrigger);

interface ProjectCardProps {
    project: Project;
    index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    const isEven = index % 2 === 0;

    useEffect(() => {
        const card = cardRef.current;
        const image = imageRef.current;
        if (!card || !image) return;

        // Card fade + slide in (starts at opacity 0, y 60 via CSS)
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 50%',
                toggleActions: 'play none none reverse',
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
        });

        // Parallax on image
        gsap.to(image, {
            scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            },
            y: -40,
            ease: 'none',
        });

        return () => {
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    }, []);

    return (
        <div
            ref={cardRef}
            className={`${styles.card} ${isEven ? styles.even : styles.odd}`}
        >
            <div ref={imageRef} className={styles.imageWrapper}>
                <img
                    src={project.image}
                    alt={project.title}
                    className={styles.image}
                    loading="lazy"
                />
            </div>

            <div className={styles.info}>
                <h3 className={styles.title}>
                    {project.link ? (
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                            {project.title}
                            <span className={styles.linkIcon} aria-hidden="true">
                                ↗
                            </span>
                        </a>
                    ) : (
                        project.title
                    )}
                </h3>

                <p className={styles.description}>{project.description}</p>

                <ul className={styles.tags}>
                    {project.tags.map((tag) => (
                        <li key={tag} className={styles.tag}>
                            {tag}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
