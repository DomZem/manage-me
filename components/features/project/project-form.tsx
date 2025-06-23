'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { projectSchema, createProjectSchema } from '@/common/validation/project';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type CreateProjectForm = {
	variant: 'create';
	onSubmit: (values: z.infer<typeof createProjectSchema>) => Promise<void>;
	isSubmitting?: boolean;
};

type UpdateProjectForm = {
	variant: 'update';
	onSubmit: (values: z.infer<typeof projectSchema>) => Promise<void>;
	project: z.infer<typeof projectSchema>;
	isSubmitting?: boolean;
};

type ProjectFormProps = CreateProjectForm | UpdateProjectForm;

export const ProjectForm = (props: ProjectFormProps) => {
	const form = useForm({
		resolver: zodResolver(props.variant === 'create' ? createProjectSchema : projectSchema),
		defaultValues:
			props.variant === 'create'
				? {
						name: '',
						description: '',
				  }
				: props.project,
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit((data) => {
					if (props.variant === 'create') {
						console.log('Submitting create project form:', data);

						props.onSubmit(data as z.infer<typeof createProjectSchema>);
						return;
					}

					console.log('Submitting update project form:', data);

					props.onSubmit(data as z.infer<typeof projectSchema>);
				})}
				className='space-y-8'
			>
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
					<Button disabled={props.isSubmitting} type='submit'>
						{props.isSubmitting ? 'Submitting' : 'Submit'}
					</Button>
				</DialogFooter>
			</form>
		</Form>
	);
};
