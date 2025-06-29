import { z } from 'zod';
import { priorityEnumSchema } from './story';

const taskBaseSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
	createdAt: z.coerce.date().default(() => new Date()),
	description: z.string().trim().min(1, 'Description is required'),
	priority: priorityEnumSchema,
	elapsedTimeToFinish: z.coerce.number().positive(),
	storyId: z.string(),
});

const todoTaskSchema = taskBaseSchema.extend({
	status: z.literal('todo'),
});

const doingTaskSchema = taskBaseSchema.extend({
	status: z.literal('doing'),
	startedAt: z.coerce.date(),
	userId: z.string(),
});

const doneTaskSchema = taskBaseSchema.extend({
	status: z.literal('done'),
	userId: z.string(),
	finishedAt: z.coerce.date(),
});

export const taskCreateSchema = z.discriminatedUnion('status', [todoTaskSchema, doingTaskSchema, doneTaskSchema]);

export const taskSchema = z.discriminatedUnion('status', [
	todoTaskSchema.extend({
		id: z.string(),
	}),
	doingTaskSchema.extend({
		id: z.string(),
	}),
	doneTaskSchema.extend({
		id: z.string(),
	}),
]);
