'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { useSetAtom } from 'jotai';
import { z } from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { refreshTasksAtom } from '@/stores/tasks-store';
import { taskSchema } from '@/common/validation/task';
import { TaskLocalStorageService } from '@/services/task';
import { StoryPriority } from '@/types/story';

export const CreateTaskForm = ({ storyId }: { storyId: string }) => {
	const { toast } = useToast();
	const refreshTasks = useSetAtom(refreshTasksAtom);

	const form = useForm<z.infer<typeof taskSchema>>({
		resolver: zodResolver(taskSchema),
		defaultValues: {
			status: 'todo',
			name: '',
			description: '',
			priority: 'medium',
			elapsedTimeToFinish: 0,
			storyId,
		},
	});

	const handleCreateTask = (task: z.infer<typeof taskSchema>) => {
		console.log(task);

		const taskService = new TaskLocalStorageService();
		const createdTask = taskService.create(task);

		toast({
			title: 'Task created',
			description: (
				<p>
					Sucessfully created <span className='font-medium'>{createdTask.name}</span> task
				</p>
			),
		});

		form.reset();
		refreshTasks();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleCreateTask)} className='space-y-8'>
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
									{Object.values(StoryPriority).map((priority) => (
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
