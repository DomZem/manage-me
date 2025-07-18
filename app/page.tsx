import { SignInForm } from '@/components/features/auth/sign-in-form';

export default function SignInPage() {
	return (
		<div className='bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
			<div className='w-full max-w-sm'>
				<SignInForm />
			</div>
		</div>
	);
}
