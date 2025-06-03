import { z } from 'zod';
import { StoryPriority, StoryStatus } from '@/types/story';

export const storySchema = z.object({
	name: z.string().min(2, {
		message: 'Name must be at least 2 characters.',
	}),
	description: z.string().min(2, {
		message: 'Description must be at least 2 characters.',
	}),
	priority: z.nativeEnum(StoryPriority),
	status: z.nativeEnum(StoryStatus),
	userId: z.string().trim().min(1, {
		message: 'User ID is required.',
	}),
	projectId: z.string().trim().min(1, {
		message: 'Project ID is required.',
	}),
});
