import { useMutation } from '@tanstack/react-query';
import { useToast } from '../use-toast';
import { useStoryTasks } from './useStoryTasks';
import { TaskFirebaseService } from '@/services/task/task-firebase';

export const useAssignUserToTask = ({ storyId }: { storyId: string }) => {
	const { toast } = useToast();
	const { refetch: refetchTasks } = useStoryTasks({ storyId, enabled: false });

	return useMutation({
		mutationFn: async (args: { taskId: string; userId: string }) => {
			const service = new TaskFirebaseService();
			const updatedTask = await service.assignUserToTask(args.taskId, args.userId);
			return updatedTask;
		},
		onSuccess: () => {
			refetchTasks();
			toast({
				title: 'Task updated',
				description: 'Sucessfully assigned user to the task',
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
