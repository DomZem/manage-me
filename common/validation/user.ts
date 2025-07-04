import { z } from 'zod';

export const USER_ROLES = ['admin', 'devops', 'developer'] as const;
export const userRoleSchema = z.enum(USER_ROLES);

export const userSchema = z.object({
	id: z.string(),
	login: z.string().trim().min(1, 'Login is required'),
	image: z.string().nullable(),
	role: userRoleSchema,
});
