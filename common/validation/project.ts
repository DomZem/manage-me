import { z } from 'zod';

export const createProjectSchema = z.object({
	name: z.string().trim().min(2, 'Name must be at least 2 characters'),
	description: z.string().trim().min(2, 'Description must be at least 2 characters'),
});

export const projectSchema = createProjectSchema.extend({
	id: z.string(),
});
