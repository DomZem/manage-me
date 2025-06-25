'use client';

import { useProject } from '@/hooks/project/useProject';
import { CreateStoryModal } from '../story/create-story-modal';

export const ProjectHeader = ({ projectId }: { projectId: string }) => {
	const { data: project } = useProject(projectId);

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
