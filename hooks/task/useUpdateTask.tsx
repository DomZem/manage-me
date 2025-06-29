import { useMutation } from '@tanstack/react-query';
import { useToast } from '../use-toast';
import type { z } from 'zod';
import { TaskFirebaseService } from '@/services/task/task-firebase';
import type { taskSchema } from '@/common/validation/task';
import { useStoryTasks } from './useStoryTasks';

export const useUpdateTask = ({ storyId, onSuccess }: { storyId: string; onSuccess?: () => void }) => {
	const { toast } = useToast();
	const { refetch: refetchTasks } = useStoryTasks({ storyId, enabled: false });

	return useMutation({
		mutationFn: async (task: z.infer<typeof taskSchema>) => {
			const service = new TaskFirebaseService();
			const updatedTask = await service.update(task);
			return updatedTask;
		},
		onSuccess: (updatedTask) => {
			toast({
				title: 'Task updated',
				description: (
					<p>
						Sucessfully updated <span className='font-medium'>{updatedTask.name}</span> task
					</p>
				),
			});

			refetchTasks();
			onSuccess?.();
		},
		onError: (error) => {
			toast({
				title: 'Task not updated',
				description: error.message,
				variant: 'destructive',
			});
		},
	});
};
