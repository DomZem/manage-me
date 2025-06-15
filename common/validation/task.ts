import { z } from 'zod';

export const taskPrioritySchema = z.enum(['low', 'medium', 'high']);

const taskBaseSchema = z.object({
	id: z.string().optional(),
	createdAt: z.coerce.date().default(() => new Date()),
	name: z.string().trim().min(1, 'Name is required'),
	description: z.string().trim().min(1, 'Description is required'),
	priority: taskPrioritySchema,
	elapsedTimeToFinish: z.coerce.number().positive(),
	storyId: z.string(),
});

const todoTaskSchema = taskBaseSchema.merge(
	z.object({
		status: z.literal('todo'),
	})
);

const doingTaskSchema = taskBaseSchema.merge(
	z.object({
		status: z.literal('doing'),
		startedAt: z.coerce.date(),
		userId: z.string(),
	})
);

const doneTaskSchema = taskBaseSchema.merge(
	z.object({
		status: z.literal('done'),
		userId: z.string(),
		finishedAt: z.coerce.date(),
	})
);

export const taskSchema = z.discriminatedUnion('status', [todoTaskSchema, doingTaskSchema, doneTaskSchema]);
