import { Separator } from './separator';

export const OrSeparator = () => {
	return (
		<div className='relative my-1 w-full'>
			<Separator />
			<div className='bg-card absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2'>
				<p className='text-muted-foreground text-sm uppercase'>or continue with</p>
			</div>
		</div>
	);
};
