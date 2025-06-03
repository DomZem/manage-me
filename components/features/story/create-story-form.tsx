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
import { refreshStoriesAtom } from '@/stores/stories-store';
import { storySchema } from '@/common/validation/story';
import { StoryPriority, StoryStatus } from '@/types/story';
import { StoryLocalStorageService } from '@/services/story';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const CreateStoryForm = ({ onSuccess, projectId }: { onSuccess: () => void; projectId: string }) => {
	const { toast } = useToast();
	const refreshStories = useSetAtom(refreshStoriesAtom);

	const form = useForm<z.infer<typeof storySchema>>({
		resolver: zodResolver(storySchema),
		defaultValues: {
			name: '',
			description: '',
			status: StoryStatus.Todo,
			priority: StoryPriority.Low,
			userId: 'unknown',
			projectId,
		},
	});

	const handleCreateStory = (story: z.infer<typeof storySchema>) => {
		console.log(story);

		const storyService = new StoryLocalStorageService();
		const createdStory = storyService.create(story);

		toast({
			title: 'Story created',
			description: (
				<p>
					Sucessfully created <span className='font-medium'>{createdStory.name}</span> story
				</p>
			),
		});

		form.reset();
		refreshStories();
		onSuccess();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleCreateStory)} className='space-y-8'>
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
									{Object.values(StoryStatus).map((status) => (
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

				<DialogFooter>
					<Button type='submit'>Create</Button>
				</DialogFooter>
			</form>
		</Form>
	);
};
