import { UserFirebaseService } from '@/services/user/user-firebase';
import { useQuery } from '@tanstack/react-query';

export const useUsers = ({ enabled = true }: { enabled?: boolean }) => {
	return useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			const service = new UserFirebaseService();
			const users = await service.getAll();
			return users;
		},
		enabled,
	});
};
