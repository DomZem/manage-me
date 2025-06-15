'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAtom, useSetAtom } from 'jotai';
import { refreshTasksAtom } from '@/stores/task/tasks-store';
import { selectedTaskStore } from '@/stores/task/selected-task-store';
import { TaskLocalStorageService } from '@/services/task';

export const DeleteTaskModal = () => {
	const [selectedTask, setSelectedTask] = useAtom(selectedTaskStore);
	const refreshTasks = useSetAtom(refreshTasksAtom);

	const { toast } = useToast();

	const handleClose = () => {
		setSelectedTask(null);
	};

	const handleDelete = () => {
		const taskService = new TaskLocalStorageService();
		const deletetdTask = taskService.delete(selectedTask!.task.id);

		if (deletetdTask) {
			refreshTasks();

			toast({
				title: 'Task deleted',
				description: (
					<p>
						Sucessfull deleted <span className='font-medium'>{deletetdTask!.name}</span> task
					</p>
				),
			});

			return;
		}

		toast({
			title: 'Task not found',
			description: (
				<p>
					Task <span className='font-medium'>{selectedTask!.task.name}</span> not found
				</p>
			),
			variant: 'destructive',
		});
	};

	return (
		<AlertDialog open={selectedTask?.action === 'delete'} onOpenChange={handleClose}>
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
