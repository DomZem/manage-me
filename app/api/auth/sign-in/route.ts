import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '@/common/constants/auth';
import { signInSchema } from '@/common/validation/auth';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const accessSecret = process.env.JWT_ACCESS_SECRET!;
const refreshSecret = process.env.JWT_REFRESH_SECRET!;

export async function POST(request: Request) {
	try {
		const body = await request.json();

		const parsed = signInSchema.parse(body);
		const { login, password } = parsed;

		// TODO: Replace with your actual authentication logic
		const user = await mockAuthenticate(login, password);

		if (!user) {
			return Response.json(
				{
					message: 'Invalid credentials',
				},
				{
					status: 401,
				}
			);
		}

		const accessToken = jwt.sign({ id: user.id, login: user.login, role: user.role }, accessSecret, { expiresIn: ACCESS_TOKEN_EXPIRY });

		const refreshToken = jwt.sign({ id: user.id }, refreshSecret, { expiresIn: REFRESH_TOKEN_EXPIRY });

		return Response.json(
			{
				accessToken,
				refreshToken,
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

// Dummy auth function — replace with actual DB check
async function mockAuthenticate(login: string, password: string) {
	if (login === 'admin' && password === 'admin') {
		return { id: 1, login: 'admin', role: 'admin' };
	}
	return null;
}
