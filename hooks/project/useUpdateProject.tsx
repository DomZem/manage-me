import { ProjectFirebaseService } from '@/services/project/project-firebase';
import type { projectSchema } from '@/common/validation/project';
import { useMutation } from '@tanstack/react-query';
import { useProjects } from './useProjects';
import { useToast } from '../use-toast';
import type { z } from 'zod';

export const useUpdateProject = ({ onSuccess }: { onSuccess?: () => void }) => {
	const { toast } = useToast();
	const { refetch: refetchProjects } = useProjects({ enabled: false });

	return useMutation({
		mutationFn: async (project: z.infer<typeof projectSchema>) => {
			const service = new ProjectFirebaseService();

			const updatedProject = await service.update(project);

			return updatedProject;
		},
		onSuccess: (updatedProject) => {
			toast({
				title: 'Project updated',
				description: (
					<p>
						Sucessfully updated <span className='font-medium'>{updatedProject.name}</span> project
					</p>
				),
			});

			refetchProjects();
			onSuccess?.();
		},
		onError: (error) => {
			toast({
				title: 'Project not updated',
				description: error.message,
				variant: 'destructive',
			});
		},
	});
};
