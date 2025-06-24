import { z } from 'zod';

export const PRIORITIES = ['low', 'medium', 'high'] as const;
export const priorityEnumSchema = z.enum(PRIORITIES);

export const STORY_STATUSES = ['todo', 'doing', 'done'] as const;
const statusSchema = z.enum(STORY_STATUSES);

export const createStorySchema = z.object({
	name: z.string().trim().min(2, 'Name must be at least 2 characters'),
	description: z.string().trim().min(2, 'Description must be at least 2 characters'),
	priority: priorityEnumSchema,
	status: statusSchema,
	userId: z.string().trim().min(1, 'User id is required'),
	projectId: z.string().trim().min(1, 'Project id is required'),
});

export const storySchema = createStorySchema.extend({
	id: z.string(),
});
