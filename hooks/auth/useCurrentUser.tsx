import type { User } from '@/types/user';
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
				const data = await res.json();
				throw new Error(data.message || 'Failed to get current user');
			}

			const data = (await res.json()) as { user: User };
			return data.user;
		},
		retry: false,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};
