import { ProjectFirebaseService } from '@/services/project/project-firebase';
import { useQuery } from '@tanstack/react-query';

export const useProject = (id: string) => {
	return useQuery({
		queryKey: ['projects', id],
		queryFn: async () => {
			const service = new ProjectFirebaseService();
			return await service.getOne(id);
		},
	});
};
