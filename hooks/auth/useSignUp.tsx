import { useMutation } from '@tanstack/react-query';
import { useToast } from '../use-toast';
import type { z } from 'zod';
import type { signUpSchema } from '@/common/validation/auth';

export const useSignUp = ({ onSuccess }: { onSuccess?: () => void }) => {
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (data: z.infer<typeof signUpSchema>) => {
			const res = await fetch('/api/auth/sign-up', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.message || 'Failed to sign up');
			}

			return res.json();
		},
		onSuccess: () => {
			toast({
				title: 'Success',
				description: 'You have successfully signed up',
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
