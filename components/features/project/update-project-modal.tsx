'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { currentProjectActionStore, selectedProjectStore } from '@/stores/project/project-store';
import { useUpdateProject } from '@/hooks/project/useUpdateProject';
import { ProjectForm } from './project-form';
import { useAtom } from 'jotai';

export const UpdateProjectModal = () => {
	const [selectedProject, setSelectedProject] = useAtom(selectedProjectStore);
	const [currentAction, setCurrentAction] = useAtom(currentProjectActionStore);

	const handleClose = () => {
		setCurrentAction(null);
	};

	const updateProject = useUpdateProject({
		onSuccess: () => {
			handleClose();
		},
	});

	return (
		<Dialog open={currentAction === 'update'} onOpenChange={handleClose}>
			<DialogContent onCloseAutoFocus={() => setSelectedProject(null)}>
				<DialogHeader>
					<DialogTitle>Update project</DialogTitle>
					<DialogDescription>Update the project details</DialogDescription>
				</DialogHeader>

				{selectedProject && (
					<ProjectForm
						variant='update'
						isSubmitting={updateProject.isPending}
						project={selectedProject}
						onSubmit={async (project) => {
							await updateProject.mutateAsync(project);
						}}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
};
