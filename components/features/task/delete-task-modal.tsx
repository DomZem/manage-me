'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAtom } from 'jotai';
import { currentTaskActionStore, selectedTaskStore } from '@/stores/task/task-store';
import type { Task } from '@/types/task';
import { useDeleteTask } from '@/hooks/task/useDeleteTask';

export const DeleteTaskModal = () => {
	const [selectedTask, setSelectedTask] = useAtom(selectedTaskStore);
	const [currentAction, setCurrentAction] = useAtom(currentTaskActionStore);

	const handleClose = () => {
		setCurrentAction(null);
	};

	return (
		<AlertDialog open={currentAction === 'delete'} onOpenChange={handleClose}>
			<AlertDialogContent onCloseAutoFocus={() => setSelectedTask(null)}>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel type='button' onClick={handleClose}>
						Cancel
					</AlertDialogCancel>
					{selectedTask && <DeleteButton task={selectedTask} />}
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

const DeleteButton = ({ task }: { task: Task }) => {
	const deleteTask = useDeleteTask({
		storyId: task.storyId,
	});

	const handleDelete = async () => {
		await deleteTask.mutateAsync(task.id);
	};

	return (
		<AlertDialogAction type='button' disabled={deleteTask.isPending} onClick={handleDelete}>
			Delete
		</AlertDialogAction>
	);
};
