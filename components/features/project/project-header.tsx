'use client';

import { ProjectLocalStorageService } from '@/services/project';
import { CreateStoryModal } from '../story/create-story-modal';

const projectService = new ProjectLocalStorageService();

export const ProjectHeader = ({ projectId }: { projectId: string }) => {
	const project = projectService.getOne(projectId);

	if (!project) {
		return null;
	}

	return (
		<div className='flex items-center justify-between'>
			<h2 className='text-lg font-semibold'>Project - {project.name}</h2>

			<CreateStoryModal projectId={projectId} />
		</div>
	);
};
