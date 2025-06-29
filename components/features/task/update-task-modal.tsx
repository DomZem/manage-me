'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAtom } from 'jotai';
import { currentTaskActionStore, selectedTaskStore } from '@/stores/task/task-store';
import { useUpdateTask } from '@/hooks/task/useUpdateTask';
import type { Task } from '@/types/task';
import { TaskForm } from './task-form';

export const UpdateTaskModal = () => {
	const [selectedTask, setSelectedStory] = useAtom(selectedTaskStore);
	const [currentAction, setCurrentAction] = useAtom(currentTaskActionStore);

	const handleClose = () => {
		setCurrentAction(null);
	};

	return (
		<Dialog open={currentAction === 'update'} onOpenChange={handleClose}>
			<DialogContent onCloseAutoFocus={() => setSelectedStory(null)}>
				<DialogHeader>
					<DialogTitle>Update task</DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>

				{selectedTask && <UpdateTaskForm task={selectedTask} onSuccess={handleClose} />}
			</DialogContent>
		</Dialog>
	);
};

const UpdateTaskForm = ({ task, onSuccess }: { task: Task; onSuccess: () => void }) => {
	const updateTask = useUpdateTask({
		storyId: task.storyId,
		onSuccess,
	});

	return (
		<TaskForm
			variant='update'
			isSubmitting={updateTask.isPending}
			task={task}
			onSubmit={async (task) => {
				await updateTask.mutateAsync(task);
			}}
		/>
	);
};
