'use client';

import { ProjectCard } from './project-card';
import Link from 'next/link';
import { useProjects } from '@/hooks/project/useProjects';

export const ProjectsList = () => {
	const { data: projects, isLoading } = useProjects({});

	if (!projects) {
		return null;
	}

	if (isLoading) {
		return <div></div>;
	}

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
