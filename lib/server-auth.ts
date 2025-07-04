import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';

const accessSecret = process.env.JWT_ACCESS_SECRET!;

export interface AuthenticatedUser {
	id: string;
	login: string;
	role: 'admin' | 'devops' | 'developer';
}

export async function getCurrentUserServer(): Promise<AuthenticatedUser | null> {
	try {
		const cookieStore = await cookies();
		const accessToken = cookieStore.get('accessToken')?.value;

		if (!accessToken) {
			return null;
		}

		const payload = jwt.verify(accessToken, accessSecret) as jwt.JwtPayload;

		return {
			id: payload.id,
			login: payload.login,
			role: payload.role,
		};
	} catch (error) {
		console.error('Failed to verify access token on server:', error);
		return null;
	}
}

export async function requireAuth(): Promise<AuthenticatedUser> {
	const user = await getCurrentUserServer();

	if (!user) {
		redirect('/');
	}

	return user;
}

export async function requireRole(allowedRoles: string[]): Promise<AuthenticatedUser> {
	const user = await requireAuth();

	if (!allowedRoles.includes(user.role)) {
		redirect('/');
	}

	return user;
}
