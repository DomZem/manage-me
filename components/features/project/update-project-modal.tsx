'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { selectedProjectStore } from '@/stores/project/selected-project-store';
import { useUpdateProject } from '@/hooks/project/useUpdateProject';
import { ProjectForm } from './project-form';
import { useAtom } from 'jotai';

export const UpdateProjectModal = () => {
	const [selectedProject, setSelectedProject] = useAtom(selectedProjectStore);

	const handleClose = () => {
		setSelectedProject(null);
	};

	const updateProject = useUpdateProject({
		onSuccess: () => {
			handleClose();
		},
	});

	return (
		<Dialog open={selectedProject?.action === 'update'} onOpenChange={handleClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update project</DialogTitle>
					<DialogDescription>Update the project details</DialogDescription>
				</DialogHeader>

				{selectedProject?.project && (
					<ProjectForm
						variant='update'
						isSubmitting={updateProject.isPending}
						project={selectedProject.project}
						onSubmit={async (project) => {
							await updateProject.mutateAsync(project);
						}}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
};
