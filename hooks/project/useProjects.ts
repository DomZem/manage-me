import { ProjectFirebaseService } from '@/services/project/project-firebase';
import { useQuery } from '@tanstack/react-query';

export const useProjects = ({ enabled = true }: { enabled?: boolean }) => {
	return useQuery({
		queryKey: ['projects'],
		queryFn: async () => {
			const service = new ProjectFirebaseService();
			return await service.getAll();
		},
		enabled,
	});
};
