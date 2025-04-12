'use client';

import { projectsAtom } from '@/stores/projects-store';
import { ProjectCard } from './project-card';
import { useAtomValue } from 'jotai';
import Link from 'next/link';

export const ProjectsList = () => {
	const projects = useAtomValue(projectsAtom);

	return (
		<ul className='flex flex-col gap-4'>
			{projects.map((project) => (
				<li key={project.id}>
					<Link href={`/projects/${project.id}`}>
						<ProjectCard project={project} />
					</Link>
				</li>
			))}
		</ul>
	);
};
