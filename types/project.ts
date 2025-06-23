import type { projectSchema } from '@/common/validation/project';
import type { z } from 'zod';

export type Project = z.infer<typeof projectSchema>;
