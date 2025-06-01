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

export const CreateProjectForm = ({ onSuccess }: { onSuccess: () => void }) => {
	const { toast } = useToast();
	const refreshProjects = useSetAtom(refreshProjectsAtom);

	const form = useForm<z.infer<typeof projectSchema>>({
		resolver: zodResolver(projectSchema),
		defaultValues: {
			name: '',
			description: '',
		},
	});

	const handleCreateProject = (project: z.infer<typeof projectSchema>) => {
		console.log(project);

		const projectService = new ProjectLocalStorageService();
		const createdProject = projectService.create(project);

		toast({
			title: 'Project created',
			description: (
				<p>
					Sucessfully created <span className='font-medium'>{createdProject.name}</span> project
				</p>
			),
		});

		form.reset();
		refreshProjects();
		onSuccess();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleCreateProject)} className='space-y-8'>
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
					<Button type='submit'>Create</Button>
				</DialogFooter>
			</form>
		</Form>
	);
};
