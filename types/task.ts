import { taskSchema } from '@/common/validation/task';
import type { z } from 'zod';

export type Task = Required<z.infer<typeof taskSchema>> & {
	createdAt: Date;
};
