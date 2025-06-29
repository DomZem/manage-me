import { useMutation } from '@tanstack/react-query';
import { useToast } from '../use-toast';
import { useStoryTasks } from './useStoryTasks';
import { TaskFirebaseService } from '@/services/task/task-firebase';

export const useDeleteTask = ({ storyId }: { storyId: string }) => {
	const { toast } = useToast();
	const { refetch: refetchTasks } = useStoryTasks({ storyId, enabled: false });

	return useMutation({
		mutationFn: async (taskId: string) => {
			const service = new TaskFirebaseService();
			const deletedTask = await service.delete(taskId);
			return deletedTask;
		},
		onSuccess: (deletedTask) => {
			refetchTasks();
			toast({
				title: 'Task deleted',
				description: (
					<p>
						Sucessfull deleted <span className='font-medium'>{deletedTask.name}</span> task
					</p>
				),
			});
		},
		onError: (error) => {
			toast({
				title: 'Task not found',
				description: error.message,
				variant: 'destructive',
			});
		},
	});
};
