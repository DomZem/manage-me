import { ProjectFirebaseService } from '@/services/project/project-firebase';
import type { createProjectSchema } from '@/common/validation/project';
import { useMutation } from '@tanstack/react-query';
import { useProjects } from './useProjects';
import { useToast } from '../use-toast';
import type { z } from 'zod';

export const useCreateProject = ({ onSuccess }: { onSuccess?: () => void }) => {
	const { toast } = useToast();
	const { refetch: refetchProjects } = useProjects({ enabled: false });

	return useMutation({
		mutationFn: async (project: z.infer<typeof createProjectSchema>) => {
			const service = new ProjectFirebaseService();

			const createdProject = await service.create(project);

			return createdProject;
		},
		onSuccess: (createdProject) => {
			toast({
				title: 'Project created',
				description: (
					<p>
						Sucessfully created <span className='font-medium'>{createdProject.name}</span> project
					</p>
				),
			});

			refetchProjects();
			onSuccess?.();
		},
		onError: (error) => {
			toast({
				title: 'Project not created',
				description: error.message,
				variant: 'destructive',
			});
		},
	});
};
