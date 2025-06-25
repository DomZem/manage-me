import { useMutation } from '@tanstack/react-query';
import { useToast } from '../use-toast';
import { useProjectStories } from './useProjectStories';
import { StoryFirebaseService } from '@/services/story/story-firebase';

export const useDeleteStory = ({ projectId }: { projectId: string }) => {
	const { toast } = useToast();
	const { refetch: refetchStories } = useProjectStories({ projectId, enabled: false });

	return useMutation({
		mutationFn: async (storyId: string) => {
			const service = new StoryFirebaseService();
			const deletedStory = await service.delete(storyId);
			return deletedStory;
		},
		onSuccess: (deletedStory) => {
			refetchStories();
			toast({
				title: 'Story deleted',
				description: (
					<p>
						Sucessfull deleted <span className='font-medium'>{deletedStory.name}</span> story
					</p>
				),
			});
		},
		onError: (error) => {
			toast({
				title: 'Story not found',
				description: error.message,
				variant: 'destructive',
			});
		},
	});
};
