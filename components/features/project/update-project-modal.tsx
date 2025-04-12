'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { selectedProjectStore } from '@/stores/selected-project-store';
import { UpdateProjectForm } from './update-project-form';
import { useAtom } from 'jotai';

export const UpdateProjectModal = () => {
	const [selectedProject, setSelectedProject] = useAtom(selectedProjectStore);

	const handleClose = () => {
		setSelectedProject(null);
	};

	return (
		<Dialog open={selectedProject?.action === 'update'} onOpenChange={handleClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update project</DialogTitle>
					<DialogDescription>Update the project details</DialogDescription>
				</DialogHeader>

				<UpdateProjectForm project={selectedProject?.project} />
			</DialogContent>
		</Dialog>
	);
};
