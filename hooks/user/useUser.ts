import { UserFirebaseService } from '@/services/user/user-firebase';
import { useQuery } from '@tanstack/react-query';

export const useUser = ({ userId, enabled = true }: { userId: string; enabled?: boolean }) => {
	return useQuery({
		queryKey: ['users', userId],
		queryFn: async () => {
			const service = new UserFirebaseService();
			const user = await service.getOne(userId);
			return user;
		},
		enabled,
	});
};
