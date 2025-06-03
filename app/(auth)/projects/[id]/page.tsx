import { ProjectStoriesList } from '@/components/features/story/project-stories-list';
import { UpdateStoryModal } from '@/components/features/story/update-story-modal';
import { DeleteStoryModal } from '@/components/features/story/delete-story-modal';
import { ProjectHeader } from '@/components/features/project/project-header';

export default async function ProjectDetailsPage({
	params,
}: {
	params: {
		id: string;
	};
}) {
	const { id: projectId } = await params;

	return (
		<div className='p-4 space-y-4 flex flex-col flex-1'>
			<ProjectHeader projectId={projectId} />

			<div className='flex flex-1 overflow-hidden'>
				<ProjectStoriesList projectId={projectId} />
			</div>

			<DeleteStoryModal />
			<UpdateStoryModal />
		</div>
	);
}
