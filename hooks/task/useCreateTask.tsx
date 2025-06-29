import { useMutation } from '@tanstack/react-query';
import { useToast } from '../use-toast';
import type { z } from 'zod';
import { TaskFirebaseService } from '@/services/task/task-firebase';
import { useStoryTasks } from './useStoryTasks';
import type { taskCreateSchema } from '@/common/validation/task';

export const useCreateTask = ({ storyId, onSuccess }: { storyId: string; onSuccess?: () => void }) => {
	const { toast } = useToast();
	const { refetch: refetchStories } = useStoryTasks({ storyId, enabled: false });

	return useMutation({
		mutationFn: async (task: z.infer<typeof taskCreateSchema>) => {
			const service = new TaskFirebaseService();
			const createdTask = await service.create(task);
			return createdTask;
		},
		onSuccess: (createdTask) => {
			toast({
				title: 'Task created',
				description: (
					<p>
						Sucessfully created <span className='font-medium'>{createdTask.name}</span> task
					</p>
				),
			});

			refetchStories();
			onSuccess?.();
		},
		onError: (error) => {
			toast({
				title: 'Task not created',
				description: error.message,
				variant: 'destructive',
			});
		},
	});
};
