'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { currentProjectActionStore, selectedProjectStore } from '@/stores/project/project-store';
import { useDeleteProject } from '@/hooks/project/useDeleteProject';
import { useAtom } from 'jotai';

export const DeleteProjectModal = () => {
	const [selectedProject, setSelectedProject] = useAtom(selectedProjectStore);
	const [currentAction, setCurrentAction] = useAtom(currentProjectActionStore);

	const deleteProject = useDeleteProject();

	const handleClose = () => {
		setCurrentAction(null);
	};

	const handleDelete = async () => {
		if (!selectedProject) return;
		await deleteProject.mutateAsync(selectedProject.id);
	};

	return (
		<AlertDialog open={currentAction === 'delete'} onOpenChange={handleClose}>
			<AlertDialogContent onCloseAutoFocus={() => setSelectedProject(null)}>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
					<AlertDialogAction disabled={deleteProject.isPending} onClick={handleDelete}>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
