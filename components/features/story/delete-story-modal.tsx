'use client';

import { selectedStoryStore } from '@/stores/story/selected-story-store';
import { StoryLocalStorageService } from '@/services/story';
import { refreshStoriesAtom } from '@/stores/story/stories-store';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAtom, useSetAtom } from 'jotai';

export const DeleteStoryModal = () => {
	const [selectedStory, setSelectedStory] = useAtom(selectedStoryStore);
	const refreshStories = useSetAtom(refreshStoriesAtom);

	const { toast } = useToast();

	const handleClose = () => {
		setSelectedStory(null);
	};

	const handleDelete = () => {
		const storyService = new StoryLocalStorageService();
		const deletetdProject = storyService.delete(selectedStory!.story.id);

		if (deletetdProject) {
			refreshStories();

			toast({
				title: 'Story deleted',
				description: (
					<p>
						Sucessfull deleted <span className='font-medium'>{deletetdProject!.name}</span> story
					</p>
				),
			});

			return;
		}

		toast({
			title: 'Story not found',
			description: (
				<p>
					Story <span className='font-medium'>{selectedStory!.story.name}</span> not found
				</p>
			),
			variant: 'destructive',
		});
	};

	return (
		<AlertDialog open={selectedStory?.action === 'delete'} onOpenChange={handleClose}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
