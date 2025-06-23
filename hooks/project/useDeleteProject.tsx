import { ProjectFirebaseService } from '@/services/project/project-firebase';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '../use-toast';
import { useProjects } from './useProjects';

export const useDeleteProject = () => {
	const { toast } = useToast();
	const { refetch: refetchProjects } = useProjects({ enabled: false });

	return useMutation({
		mutationFn: async (projectId: string) => {
			const service = new ProjectFirebaseService();

			const deletedProject = await service.delete(projectId);

			return deletedProject;
		},
		onSuccess: (deletedProject) => {
			refetchProjects();

			toast({
				title: 'Project deleted',
				description: (
					<p>
						Sucessfull deleted <span className='font-medium'>{deletedProject.name}</span> project
					</p>
				),
			});
		},
		onError: (error) => {
			toast({
				title: 'Project not found',
				description: error.message,
				variant: 'destructive',
			});
		},
	});
};
