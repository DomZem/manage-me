'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { selectedStoryStore } from '@/stores/story/selected-story-store';
import { useAtom } from 'jotai';
import { StoryForm } from './story-form';
import { useUpdateStory } from '@/hooks/story/useUpdateStory';

export const UpdateStoryModal = () => {
	const [selectedStory, setSelectedStory] = useAtom(selectedStoryStore);

	const handleClose = () => {
		setSelectedStory(null);
	};

	const updateStory = useUpdateStory({
		projectId: selectedStory?.story?.projectId || '',
		onSuccess: () => {
			handleClose();
		},
	});

	return (
		<Dialog open={selectedStory?.action === 'update'} onOpenChange={handleClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update story</DialogTitle>
					<DialogDescription>Update the story details</DialogDescription>
				</DialogHeader>

				{selectedStory?.story && (
					<StoryForm
						variant='update'
						isSubmitting={updateStory.isPending}
						story={selectedStory.story}
						onSubmit={async (story) => {
							await updateStory.mutateAsync(story);
						}}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
};
