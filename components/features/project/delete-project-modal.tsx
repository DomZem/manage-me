'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { selectedProjectStore } from '@/stores/selected-project-store';
import { ProjectLocalStorageService } from '@/services/project';
import { refreshProjectsAtom } from '@/stores/projects-store';
import { useToast } from '@/hooks/use-toast';
import { useAtom, useSetAtom } from 'jotai';

export const DeleteProjectModal = () => {
	const [selectedProject, setSelectedProject] = useAtom(selectedProjectStore);
	const refreshProjects = useSetAtom(refreshProjectsAtom);

	const { toast } = useToast();

	const handleClose = () => {
		setSelectedProject(null);
	};

	const handleDelete = () => {
		const projectService = new ProjectLocalStorageService();
		const deletetdProject = projectService.delete(selectedProject!.project.id);

		if (deletetdProject) {
			refreshProjects();

			toast({
				title: 'Project deleted',
				description: (
					<p>
						Sucessfull deleted <span className='font-medium'>{deletetdProject!.name}</span> project
					</p>
				),
			});

			return;
		}

		toast({
			title: 'Project not found',
			description: (
				<p>
					Project <span className='font-medium'>{selectedProject!.project.name}</span> not found
				</p>
			),
			variant: 'destructive',
		});
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
					<AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
