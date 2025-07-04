import { cookies } from 'next/headers';

export async function POST() {
	try {
		const cookieStore = await cookies();

		// Clear the HTTP-only cookies
		cookieStore.delete('accessToken');
		cookieStore.delete('refreshToken');

		return Response.json(
			{
				message: 'Successfully logged out',
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		console.error('Logout error:', error);

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
