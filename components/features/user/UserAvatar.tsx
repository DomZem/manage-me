'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/hooks/user/useUser';

export const UserAvatar = ({ userId }: { userId: string }) => {
	const { data: user, isLoading } = useUser({
		userId,
	});

	if (isLoading) {
		return <Skeleton className='size-9 rounded-full' />;
	}

	return (
		<Avatar className='size-9'>
			<AvatarImage src={user?.image ?? undefined} />
			<AvatarFallback>{user?.login ? user.login.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
		</Avatar>
	);
};
