import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PRIORITIES, STORY_STATUSES } from '@/common/validation/story';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { taskSchema, taskCreateSchema } from '@/common/validation/task';

type CreateTaskForm = {
	variant: 'create';
	storyId: string;
	onSubmit: (values: z.infer<typeof taskCreateSchema>) => Promise<void>;
	isSubmitting?: boolean;
};

type UpdateTaskForm = {
	variant: 'update';
	onSubmit: (values: z.infer<typeof taskSchema>) => Promise<void>;
	task: z.infer<typeof taskSchema>;
	isSubmitting?: boolean;
};

type TaskFormProps = CreateTaskForm | UpdateTaskForm;

export const TaskForm = (props: TaskFormProps) => {
	const form = useForm({
		resolver: zodResolver(props.variant === 'create' ? taskCreateSchema : taskSchema),
		defaultValues:
			props.variant === 'create'
				? {
						name: '',
						description: '',
						status: STORY_STATUSES[0],
						priority: PRIORITIES[0],
						storyId: props.storyId,
						elapsedTimeToFinish: 0,
				  }
				: {
						...props.task,
				  },
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit((data) => {
					if (props.variant === 'create') {
						props.onSubmit(data as z.infer<typeof taskCreateSchema>);
						form.reset();
						return;
					}

					props.onSubmit(data as z.infer<typeof taskSchema>);
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

				<FormField
					control={form.control}
					name='elapsedTimeToFinish'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Elapsed Time to Finish (in hours)</FormLabel>
							<FormControl>
								<Input placeholder='' {...field} type='number' />
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
