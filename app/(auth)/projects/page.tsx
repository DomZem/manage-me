import { CreateProjectModal } from '@/components/features/project/create-project-modal';
import { DeleteProjectModal } from '@/components/features/project/delete-project-modal';
import { ProjectsList } from '@/components/features/project/projects-list';
import { UpdateProjectModal } from '@/components/features/project/update-project-modal';

export default function ProjectsPage() {
	return (
		<div className='p-4 space-y-4'>
			<div className='flex items-center justify-between'>
				<h2 className='text-lg font-semibold'>Projects</h2>
				<CreateProjectModal />
			</div>

			<ProjectsList />

			<DeleteProjectModal />
			<UpdateProjectModal />
		</div>
	);
}
