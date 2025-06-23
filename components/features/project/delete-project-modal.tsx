'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { selectedProjectStore } from '@/stores/project/selected-project-store';
import { useDeleteProject } from '@/hooks/project/useDeleteProject';
import { useAtom } from 'jotai';

export const DeleteProjectModal = () => {
	const [selectedProject, setSelectedProject] = useAtom(selectedProjectStore);
	const deleteProject = useDeleteProject();

	const handleClose = () => {
		setSelectedProject(null);
	};

	const handleDelete = async () => {
		if (!selectedProject) return;
		await deleteProject.mutateAsync(selectedProject.project.id);
	};

	return (
		<AlertDialog open={selectedProject?.action === 'delete'} onOpenChange={handleClose}>
			<AlertDialogContent>
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
