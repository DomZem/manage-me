import { requireRole } from '@/lib/server-auth';

export default async function AdminPage() {
	// This will redirect to home page if user doesn't have admin role
	const currentUser = await requireRole(['admin']);

	return (
		<div className='p-6'>
			<h1 className='text-2xl font-bold mb-4'>Admin Dashboard</h1>
			<p>Welcome, {currentUser.login}! You have admin access.</p>
			<div className='mt-4 p-4 bg-gray-100 rounded'>
				<h2 className='font-semibold'>User Info:</h2>
				<p>ID: {currentUser.id}</p>
				<p>Login: {currentUser.login}</p>
				<p>Role: {currentUser.role}</p>
			</div>
		</div>
	);
}
