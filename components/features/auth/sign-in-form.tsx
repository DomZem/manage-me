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
import { useRouter } from 'next/navigation';
import { OrSeparator } from '@/components/ui/or-separator';
import { useSignIn } from '@/hooks/auth/useSignIn';

export const SignInForm = () => {
	const router = useRouter();

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			login: '',
			password: '',
		},
	});

	const signIn = useSignIn({
		onSuccess: () => {
			router.push('/projects');
		},
	});

	const handleSignIn = async (data: z.infer<typeof signInSchema>) => {
		await signIn.mutateAsync(data);
	};

	return (
		<div className={cn('flex flex-col gap-6')}>
			<div className='flex flex-col items-center gap-2'>
				<Link href='/' className='flex flex-col items-center gap-2 font-medium'>
					<GalleryVerticalEnd />
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

					<div className='flex flex-col gap-4'>
						<Button className='w-full capitalize' type='submit' disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? 'signing in...' : 'sign in'}
						</Button>

						<OrSeparator />

						<Button asChild className='w-full capitalize' variant='outline' type='button'>
							<Link href='/sign-up'>sign up</Link>
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};
