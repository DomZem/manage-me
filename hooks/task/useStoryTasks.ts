import { TaskFirebaseService } from '@/services/task/task-firebase';
import { useQuery } from '@tanstack/react-query';

export const useStoryTasks = ({ storyId, enabled = true }: { storyId: string; enabled?: boolean }) => {
	return useQuery({
		queryKey: ['storyTasks', storyId],
		queryFn: async () => {
			const service = new TaskFirebaseService();
			return await service.getAllByStoryId(storyId);
		},
		enabled,
	});
};
