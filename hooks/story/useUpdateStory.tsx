import { useMutation } from '@tanstack/react-query';
import { useToast } from '../use-toast';
import type { z } from 'zod';
import type { storySchema } from '@/common/validation/story';
import { useProjectStories } from './useProjectStories';
import { StoryFirebaseService } from '@/services/story/story-firebase';

export const useUpdateStory = ({ projectId, onSuccess }: { projectId: string; onSuccess?: () => void }) => {
	const { toast } = useToast();
	const { refetch: refetchStories } = useProjectStories({ projectId, enabled: false });

	return useMutation({
		mutationFn: async (story: z.infer<typeof storySchema>) => {
			const service = new StoryFirebaseService();
			const updatedStory = await service.update(story);
			return updatedStory;
		},
		onSuccess: (updatedStory) => {
			toast({
				title: 'Story updated',
				description: (
					<p>
						Sucessfully updated <span className='font-medium'>{updatedStory.name}</span> story
					</p>
				),
			});

			refetchStories();
			onSuccess?.();
		},
		onError: (error) => {
			toast({
				title: 'Story not updated',
				description: error.message,
				variant: 'destructive',
			});
		},
	});
};
