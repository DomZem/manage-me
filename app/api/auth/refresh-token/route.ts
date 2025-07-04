import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '@/common/constants/auth';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const accessSecret = process.env.JWT_ACCESS_SECRET!;
const refreshSecret = process.env.JWT_REFRESH_SECRET!;

export async function POST() {
	try {
		const cookieStore = await cookies();
		const refreshToken = cookieStore.get('refreshToken')?.value;

		if (!refreshToken) {
			return Response.json(
				{ error: 'Refresh token is required' },
				{
					status: 400,
				}
			);
		}

		let payload: jwt.JwtPayload;

		try {
			payload = jwt.verify(refreshToken, refreshSecret) as jwt.JwtPayload;
		} catch (error) {
			console.error('Invalid refresh token:', error);
			return Response.json({ error: 'Invalid or expired refresh token' }, { status: 401 });
		}

		const newAccessToken = jwt.sign({ id: payload.id, login: payload.login, role: payload.role }, accessSecret, { expiresIn: ACCESS_TOKEN_EXPIRY });
		const newRefreshToken = jwt.sign({ id: payload.id }, refreshSecret, { expiresIn: REFRESH_TOKEN_EXPIRY });

		// Set new HTTP-only cookies
		cookieStore.set('accessToken', newAccessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 15 * 60, // 15 minutes in seconds
			path: '/',
		});

		cookieStore.set('refreshToken', newRefreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
			path: '/',
		});

		return Response.json(
			{
				message: 'Tokens refreshed successfully',
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		console.error('Refresh token error:', error);

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
