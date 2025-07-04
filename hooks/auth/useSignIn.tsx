import { useMutation } from '@tanstack/react-query';
import { useToast } from '../use-toast';
import type { z } from 'zod';
import type { signInSchema } from '@/common/validation/auth';

export const useSignIn = ({ onSuccess }: { onSuccess?: () => void }) => {
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: z.infer<typeof signInSchema>) => {
			const res = await fetch('/api/auth/sign-in', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.message || 'Failed to sign in');
			}

			return res.json();
		},
		onSuccess: () => {
			toast({
				title: 'Success',
				description: 'You have successfully signed in',
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
