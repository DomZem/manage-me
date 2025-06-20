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
import { storySchema } from '@/common/validation/story';
import { StoryPriority, StoryStatus, type Story } from '@/types/story';
import { refreshStoriesAtom } from '@/stores/story/stories-store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StoryLocalStorageService } from '@/services/story';

const updateStorySchema = storySchema.merge(
	z.object({
		id: z.string(),
	})
);

export const UpdateStoryForm = ({ story, onSuccess }: { story?: Story; onSuccess: () => void }) => {
	const { toast } = useToast();
	const refreshStories = useSetAtom(refreshStoriesAtom);

	const form = useForm<z.infer<typeof updateStorySchema>>({
		resolver: zodResolver(updateStorySchema),
		defaultValues: story,
	});

	const handleUpdateStory = (story: z.infer<typeof updateStorySchema>) => {
		console.log(story);
		const storyService = new StoryLocalStorageService();
		storyService.update(story.id, story);

		toast({
			title: 'Story update',
			description: (
				<p>
					Sucessfully updated <span className='font-medium'>{story.name}</span> story
				</p>
			),
		});

		form.reset();
		refreshStories();
		onSuccess();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleUpdateStory)} className='space-y-8'>
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
								<Textarea className='resize-none' {...field} />
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
					<Button type='submit'>Update</Button>
				</DialogFooter>
			</form>
		</Form>
	);
};
