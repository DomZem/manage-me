'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ProjectLocalStorageService } from '@/services/project';
import { refreshProjectsAtom } from '@/stores/projects-store';
import { projectSchema } from '@/common/validation/project';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { useSetAtom } from 'jotai';
import { z } from 'zod';
import { Project } from '@/types/project';

const updateProjectSchema = projectSchema.merge(
	z.object({
		id: z.string(),
	})
);

export const UpdateProjectForm = ({ project }: { project?: Project }) => {
	const { toast } = useToast();
	const refreshProjects = useSetAtom(refreshProjectsAtom);

	const form = useForm<z.infer<typeof updateProjectSchema>>({
		resolver: zodResolver(updateProjectSchema),
		defaultValues: project,
	});

	const handleUpdateProject = (project: z.infer<typeof updateProjectSchema>) => {
		console.log(project);
		const projectService = new ProjectLocalStorageService();
		projectService.update(project.id, project);

		toast({
			title: 'Project update',
			description: (
				<p>
					Sucessfully updated <span className='font-medium'>{project.name}</span> project
				</p>
			),
		});

		form.reset();
		refreshProjects();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleUpdateProject)} className='space-y-8'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder='shadcn' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='description'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea placeholder='Tell us a little bit about yourself' className='resize-none' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<DialogFooter>
					<Button type='submit'>Update</Button>
				</DialogFooter>
			</form>
		</Form>
	);
};
