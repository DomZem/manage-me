import { z } from 'zod';
import { userSchema } from './user';

const passwordSchema = z
	.string({ required_error: 'Password is required' })
	.trim()
	.min(1, 'Password is required')
	.min(8, 'Password must be more than 8 characters')
	.max(32, 'Password must be less than 32 characters');

export const signInSchema = userSchema
	.pick({
		login: true,
	})
	.extend({
		password: passwordSchema,
	});

export const signUpSchema = userSchema
	.omit({
		id: true,
	})
	.extend({
		password: passwordSchema,
		repeatPassword: passwordSchema,
	})
	.refine((data) => data.password === data.repeatPassword, {
		message: 'Passwords must match',
	});
