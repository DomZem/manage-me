import { useMutation } from '@tanstack/react-query';
import { useToast } from '../use-toast';
import type { z } from 'zod';
import { useProjectStories } from './useProjectStories';
import type { createStorySchema } from '@/common/validation/story';
import { StoryFirebaseService } from '@/services/story/story-firebase';

export const useCreateStory = ({ projectId, onSuccess }: { projectId: string; onSuccess?: () => void }) => {
	const { toast } = useToast();
	const { refetch: refetchStories } = useProjectStories({ projectId, enabled: false });

	return useMutation({
		mutationFn: async (story: z.infer<typeof createStorySchema>) => {
			const service = new StoryFirebaseService();
			const createdStory = await service.create(story);
			return createdStory;
		},
		onSuccess: (createdStory) => {
			toast({
				title: 'Story created',
				description: (
					<p>
						Sucessfully created <span className='font-medium'>{createdStory.name}</span> story
					</p>
				),
			});

			refetchStories();
			onSuccess?.();
		},
		onError: (error) => {
			toast({
				title: 'Story not created',
				description: error.message,
				variant: 'destructive',
			});
		},
	});
};
