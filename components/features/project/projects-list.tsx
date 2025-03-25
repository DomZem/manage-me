'use client';

import { ProjectLocalStorageService } from '@/services/project';
import { ProjectCard } from './project-card';

export const ProjectsList = () => {
	const service = new ProjectLocalStorageService();

	const projects = service.getAll();

	return (
		<ul className='flex flex-col gap-4'>
			{projects.map((project) => (
				<li key={project.id}>
					<ProjectCard project={project} />
				</li>
			))}
		</ul>
	);
};
