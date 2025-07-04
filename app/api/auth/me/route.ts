import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const accessSecret = process.env.JWT_ACCESS_SECRET!;

export async function GET() {
	try {
		const cookieStore = await cookies();
		const accessToken = cookieStore.get('accessToken')?.value;

		if (!accessToken) {
			return Response.json(
				{ error: 'No access token found' },
				{
					status: 401,
				}
			);
		}

		let payload: jwt.JwtPayload;
		try {
			payload = jwt.verify(accessToken, accessSecret) as jwt.JwtPayload;
		} catch (error) {
			console.error('Invalid access token:', error);

			return Response.json({ error: 'Invalid or expired access token' }, { status: 401 });
		}

		return Response.json(
			{
				user: {
					id: payload.id,
					login: payload.login,
					role: payload.role,
				},
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		console.error('Get user error:', error);

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
