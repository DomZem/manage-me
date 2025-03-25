'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ProjectLocalStorageService } from '@/services/project';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const createProjectSchema = z.object({
	name: z.string().min(2, {
		message: 'Name must be at least 2 characters.',
	}),
	description: z.string().min(2, {
		message: 'Description must be at least 2 characters.',
	}),
});

export const CreateProjectForm = () => {
	const { toast } = useToast();

	const form = useForm<z.infer<typeof createProjectSchema>>({
		resolver: zodResolver(createProjectSchema),
		defaultValues: {
			name: '',
			description: '',
		},
	});

	const handleCreateProject = (project: z.infer<typeof createProjectSchema>) => {
		console.log(project);
		const projectService = new ProjectLocalStorageService();
		projectService.create(project);

		toast({
			title: 'Project created',
			description: (
				<p>
					Sucessfull created <span className='font-medium'>{project.name}</span> project
				</p>
			),
		});

		form.reset();
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
				<Button type='submit'>Create</Button>
			</form>
		</Form>
	);
};
