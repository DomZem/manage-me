import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '@/common/constants/auth';
import { signUpSchema } from '@/common/validation/auth';
import { AuthFirebaseService } from '@/services/auth';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { cookies } from 'next/headers';

const accessSecret = process.env.JWT_ACCESS_SECRET!;
const refreshSecret = process.env.JWT_REFRESH_SECRET!;

export async function POST(request: Request) {
	try {
		const body = await request.json();

		const data = signUpSchema.parse(body);

		const authService = new AuthFirebaseService();
		const response = await authService.signUp(data);

		if (response.status === 'error') {
			return Response.json(
				{
					message: 'Invalid credentials',
				},
				{
					status: 401,
				}
			);
		}

		const user = response.user;

		const accessToken = jwt.sign({ id: user.id, login: user.login, role: user.role }, accessSecret, { expiresIn: ACCESS_TOKEN_EXPIRY });
		const refreshToken = jwt.sign({ id: user.id }, refreshSecret, { expiresIn: REFRESH_TOKEN_EXPIRY });

		// Set HTTP-only cookies
		const cookieStore = await cookies();
		cookieStore.set('accessToken', accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 15 * 60, // 15 minutes in seconds
			path: '/',
		});

		cookieStore.set('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
			path: '/',
		});

		return Response.json(
			{
				message: 'Successfully signed up',
				user: {
					id: user.id,
					login: user.login,
					role: user.role,
					image: user.image,
				},
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return Response.json(
				{
					errors: error.flatten(),
				},
				{
					status: 400,
				}
			);
		}

		console.error('Server error:', error);

		return Response.json(
			{
				error: 'Internal server error',
			},
			{
				status: 500,
			}
		);
	}
}
