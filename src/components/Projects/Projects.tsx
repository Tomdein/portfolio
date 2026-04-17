import { loadProjects } from '@/utils/loadProjects';
import ProjectCard from './ProjectCard';
import styles from './Projects.module.scss';

const projects = loadProjects();

export default function Projects() {
    return (
        <section className={styles.projects}>
            <div className={styles.container}>
                <h2 className={styles.heading}>Projects</h2>
                <div className={styles.list}>
                    {projects.map((project, index) => (
                        <ProjectCard key={project.title} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
