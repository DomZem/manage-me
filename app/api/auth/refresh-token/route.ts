import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '@/common/constants/auth';
import jwt from 'jsonwebtoken';

const accessSecret = process.env.JWT_ACCESS_SECRET!;
const refreshSecret = process.env.JWT_REFRESH_SECRET!;

export async function POST(request: Request) {
	try {
		const { refreshToken } = await request.json();

		if (!refreshToken) {
			return Response.json(
				{ error: 'Refresh token is required' },
				{
					status: 400,
				}
			);
		}

		let payload: any;
		try {
			payload = jwt.verify(refreshToken, refreshSecret);
		} catch (error) {
			console.error('Invalid refresh token:', error);

			return Response.json({ error: 'Invalid or expired refresh token' }, { status: 401 });
		}

		const newAccessToken = jwt.sign({ id: payload.id, login: payload.login, role: payload.role }, accessSecret, { expiresIn: ACCESS_TOKEN_EXPIRY });
		const newRefreshToken = jwt.sign({ id: payload.id }, refreshSecret, { expiresIn: REFRESH_TOKEN_EXPIRY });

		return Response.json(
			{
				accessToken: newAccessToken,
				refreshToken: newRefreshToken,
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
