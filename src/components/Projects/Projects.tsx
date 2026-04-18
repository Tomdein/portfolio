import { loadProjects } from '@/utils/loadProjects';
import ProjectCard from './ProjectCard';
import styles from './Projects.module.scss';
import { use, useEffect, useRef } from 'react';
import gsap from 'gsap';

const projects = loadProjects();

export default function Projects() {
    const headingRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const heading = headingRef.current;
        if (!heading) return;

        gsap.from(heading, {
            scrollTrigger: {
                trigger: heading,
                start: 'top 70%',
                end: 'bottom 40%',
                toggleActions: 'play complete none reverse',
                scrub: 0.5,
                // markers: true,
                fastScrollEnd: true,
            },
            keyframes: [
                // { y: 60, opacity: 0, duration: 0.5, ease: 'none', at: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: 'sine.in', at: 0.1 },
                // { y: 0, opacity: 1, duration: 0.5, ease: 'sine.in', at: 0.7 },
                // { y: -20, opacity: 0, duration: 0.5, ease: 'sine.out', at: 1 },
            ],
        });
    }, []);

    return (
        <section className={styles.projects}>
            <div className={styles.container}>
                <h2 ref={headingRef} className={styles.heading}>Projects</h2>
                <div className={styles.list}>
                    {projects.map((project, index) => (
                        <ProjectCard key={project.title} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
