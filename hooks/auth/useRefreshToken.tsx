import { useMutation } from '@tanstack/react-query';

export const useRefreshToken = () => {
	return useMutation({
		mutationFn: async () => {
			const res = await fetch('/api/auth/refresh-token', {
				method: 'POST',
				credentials: 'include', // Important: include cookies
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.message || 'Failed to refresh token');
			}

			return res.json();
		},
	});
};
