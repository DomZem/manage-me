import { useQuery } from '@tanstack/react-query';

export const useCurrentUser = () => {
	return useQuery({
		queryKey: ['current-user'],
		queryFn: async () => {
			const res = await fetch('/api/auth/me', {
				method: 'GET',
				credentials: 'include', // Important: include cookies
			});

			if (!res.ok) {
				if (res.status === 401) {
					return null; // User not authenticated
				}
				const data = await res.json();
				throw new Error(data.message || 'Failed to get current user');
			}

			const data = await res.json();
			return data.user;
		},
		retry: false, // Don't retry on 401 errors
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};
