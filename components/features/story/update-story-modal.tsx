'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { currentStoryActionStore, selectedStoryStore } from '@/stores/story/story-store';
import { useAtom } from 'jotai';
import { StoryForm } from './story-form';
import { useUpdateStory } from '@/hooks/story/useUpdateStory';
import type { Story } from '@/types/story';

export const UpdateStoryModal = () => {
	const [selectedStory, setSelectedStory] = useAtom(selectedStoryStore);
	const [currentAction, setCurrentAction] = useAtom(currentStoryActionStore);

	const handleClose = () => {
		setCurrentAction(null);
	};

	return (
		<Dialog open={currentAction === 'update'} onOpenChange={handleClose}>
			<DialogContent onCloseAutoFocus={() => setSelectedStory(null)}>
				<DialogHeader>
					<DialogTitle>Update story</DialogTitle>
					<DialogDescription>Update the story details</DialogDescription>
				</DialogHeader>

				{selectedStory && <UpdateStoryForm story={selectedStory} onSuccess={handleClose} />}
			</DialogContent>
		</Dialog>
	);
};

const UpdateStoryForm = ({ story, onSuccess }: { story: Story; onSuccess: () => void }) => {
	const updateStory = useUpdateStory({
		projectId: story.projectId,
		onSuccess,
	});

	return (
		<StoryForm
			variant='update'
			isSubmitting={updateStory.isPending}
			story={story}
			onSubmit={async (story) => {
				await updateStory.mutateAsync(story);
			}}
		/>
	);
};
