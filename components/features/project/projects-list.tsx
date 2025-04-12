'use client';

import { ProjectLocalStorageService } from '@/services/project';
import { ProjectCard } from './project-card';
import Link from 'next/link';

export const ProjectsList = () => {
	const service = new ProjectLocalStorageService();

	const projects = service.getAll();

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
