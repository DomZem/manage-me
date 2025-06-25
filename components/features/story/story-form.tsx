'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createStorySchema, PRIORITIES, STORY_STATUSES, storySchema } from '@/common/validation/story';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type CreateStoryForm = {
	variant: 'create';
	projectId: string;
	onSubmit: (values: z.infer<typeof createStorySchema>) => Promise<void>;
	isSubmitting?: boolean;
};

type UpdateStoryForm = {
	variant: 'update';
	onSubmit: (values: z.infer<typeof storySchema>) => Promise<void>;
	story: z.infer<typeof storySchema>;
	isSubmitting?: boolean;
};

type StoryFormProps = CreateStoryForm | UpdateStoryForm;

export const StoryForm = (props: StoryFormProps) => {
	const form = useForm({
		resolver: zodResolver(props.variant === 'create' ? createStorySchema : storySchema),
		defaultValues:
			props.variant === 'create'
				? {
						name: '',
						description: '',
						status: STORY_STATUSES[0],
						priority: PRIORITIES[0],
						projectId: props.projectId,
						userId: 'dominik',
				  }
				: props.story,
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit((data) => {
					if (props.variant === 'create') {
						props.onSubmit(data as z.infer<typeof createStorySchema>);
						return;
					}

					props.onSubmit(data as z.infer<typeof storySchema>);
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
								<Input placeholder='' {...field} />
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
								<Textarea placeholder='' className='resize-none' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='status'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Status</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Select a story status' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{STORY_STATUSES.map((status) => (
										<SelectItem key={status} value={status}>
											{status.charAt(0).toUpperCase() + status.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='priority'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Priority</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Select a story priority' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{PRIORITIES.map((priority) => (
										<SelectItem key={priority} value={priority}>
											{priority.charAt(0).toUpperCase() + priority.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
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
