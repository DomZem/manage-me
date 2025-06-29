import { useCreateTask } from '@/hooks/task/useCreateTask';
import { TaskForm } from './task-form';

export const CreateTaskForm = ({ storyId }: { storyId: string }) => {
	const createTask = useCreateTask({
		storyId,
	});

	return (
		<div className='flex-1'>
			<TaskForm
				variant='create'
				storyId={storyId}
				isSubmitting={createTask.isPending}
				onSubmit={async (task) => {
					await createTask.mutateAsync(task);
				}}
			/>
		</div>
	);
};
