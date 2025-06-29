import { TaskFirebaseService } from '@/services/task/task-firebase';
import { useToast } from '../use-toast';
import { useStoryTasks } from './useStoryTasks';
import { useMutation } from '@tanstack/react-query';

export const useMarkTaskAsDone = ({ storyId }: { storyId: string }) => {
	const { toast } = useToast();
	const { refetch: refetchTasks } = useStoryTasks({ storyId, enabled: false });

	return useMutation({
		mutationFn: async (taskId: string) => {
			const service = new TaskFirebaseService();
			const updatedTask = await service.markAsDone(taskId);
			return updatedTask;
		},
		onSuccess: () => {
			refetchTasks();
			toast({
				title: 'Task updated',
				description: 'Sucessfully marked task as done',
			});
		},
		onError: (error) => {
			toast({
				title: 'Task update failed',
				description: error.message,
				variant: 'destructive',
			});
		},
	});
};
