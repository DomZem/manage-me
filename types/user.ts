import type { userSchema } from '@/common/validation/user';
import type { z } from 'zod';

export type User = z.infer<typeof userSchema>;
