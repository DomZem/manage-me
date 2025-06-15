'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { type z } from 'zod';
import { signInSchema } from '@/common/validation/auth';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GalleryVerticalEnd } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export const SignInForm = () => {
	const router = useRouter();
	const { toast } = useToast();

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			login: '',
			password: '',
		},
	});

	const handleSignIn = async (data: z.infer<typeof signInSchema>) => {
		try {
			const res = await fetch('/api/auth/sign-in', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			console.log('sign-in response:', res);

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.message || 'Failed to sign in');
			}

			toast({
				title: 'Success',
				description: 'You have successfully signed in.',
			});

			router.push('/projects');
		} catch (error) {
			console.error('Sign-in error:', error);

			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'An unexpected error occurred',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className={cn('flex flex-col gap-6')}>
			<div className='flex flex-col items-center gap-2'>
				<Link href='/' className='flex flex-col items-center gap-2 font-medium'>
					<GalleryVerticalEnd />
					{/* <Image src='./logo.svg' width={32} height={32} alt='vieforit logo' /> */}
					<span className='sr-only'>ManageMe</span>
				</Link>
				<h1 className='text-xl font-bold'>Welcome to ManageMe</h1>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSignIn)} className='space-y-6'>
					<FormField
						control={form.control}
						name='login'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Login</FormLabel>
								<FormControl>
									<Input placeholder='' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type='password' placeholder='' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button className='w-full capitalize' type='submit' disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting ? 'signing in...' : 'sign in'}
					</Button>
				</form>
			</Form>
		</div>
	);
};
