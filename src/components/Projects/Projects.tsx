import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ProjectsConfig } from '@/types/config';
import ProjectCard from './ProjectCard';
import styles from './Projects.module.scss';

gsap.registerPlugin(ScrollTrigger);

interface ProjectsProps {
    config: ProjectsConfig;
}

export default function Projects({ config }: ProjectsProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);

    const projects = [...config.projects].sort((a, b) => a.order - b.order);

    useGSAP(
        () => {
            const heading = headingRef.current;
            if (!heading) return;
            gsap.from(heading, {
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 70%',
                    scrub: true,
                },
                y: 40,
                opacity: 0,
            });
        },
        { scope: sectionRef },
    );

    return (
        <section ref={sectionRef} className={styles.projects}>
            <div className={styles.container}>
                <h2 ref={headingRef} className={styles.heading}>
                    Projects
                </h2>
                <div className={styles.list}>
                    {projects.map((project, index) => (
                        <ProjectCard key={project.title} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
