import { z } from 'zod';
import { userRoleSchema } from './user';

const passwordSchema = z
	.string({ required_error: 'Password is required' })
	.min(1, 'Password is required')
	.min(8, 'Password must be more than 8 characters')
	.max(32, 'Password must be less than 32 characters');

export const signInSchema = z.object({
	login: z.string().trim().min(1, 'Login is required'),
	password: passwordSchema,
});

export const signUpSchema = z
	.object({
		login: z.string().trim().min(1, 'Login is required'),
		image: z.string().nullable(),
		password: passwordSchema,
		role: userRoleSchema,
		repeatPassword: passwordSchema,
	})
	.refine((data) => data.password === data.repeatPassword, {
		message: 'Passwords must match',
	});
