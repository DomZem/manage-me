import { type taskSchema } from '@/common/validation/task';
import type { z } from 'zod';

export type Task = z.infer<typeof taskSchema>;
