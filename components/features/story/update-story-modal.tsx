'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { selectedStoryStore } from '@/stores/story/selected-story-store';
import { UpdateStoryForm } from './update-story-form';
import { useAtom } from 'jotai';

export const UpdateStoryModal = () => {
	const [selectedStory, setSelectedStory] = useAtom(selectedStoryStore);

	const handleClose = () => {
		setSelectedStory(null);
	};

	return (
		<Dialog open={selectedStory?.action === 'update'} onOpenChange={handleClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update story</DialogTitle>
					<DialogDescription>Update the story details</DialogDescription>
				</DialogHeader>

				<UpdateStoryForm story={selectedStory?.story} onSuccess={handleClose} />
			</DialogContent>
		</Dialog>
	);
};
