import { StoryFirebaseService } from '@/services/story/story-firebase';
import { useQuery } from '@tanstack/react-query';

export const useProjectStories = ({ projectId, enabled = true }: { projectId: string; enabled?: boolean }) => {
	return useQuery({
		queryKey: ['projectStories', projectId],
		queryFn: async () => {
			const service = new StoryFirebaseService();
			const stories = await service.getAllByProjectId(projectId);
			return stories;
		},
		enabled,
	});
};
