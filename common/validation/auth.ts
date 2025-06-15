import { z } from 'zod';

export const signInSchema = z.object({
	login: z.string().trim().min(1, 'Login is required'),
	password: z.string().trim().min(1, 'Password is required'),
});
