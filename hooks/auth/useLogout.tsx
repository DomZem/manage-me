import { useMutation } from '@tanstack/react-query';
import { useToast } from '../use-toast';

export const useLogout = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
	const { toast } = useToast();

	return useMutation({
		mutationFn: async () => {
			const res = await fetch('/api/auth/logout', {
				method: 'POST',
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.message || 'Failed to logout');
			}
		},
		onSuccess: () => {
			toast({
				title: 'Success',
				description: 'You have successfully logged out',
			});

			onSuccess?.();
		},
		onError: (error) => {
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'An unexpected error occurred',
				variant: 'destructive',
			});
		},
	});
};
