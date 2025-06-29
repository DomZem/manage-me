'use client';

import { currentStoryActionStore, selectedStoryStore } from '@/stores/story/story-store';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAtom } from 'jotai';
import { useDeleteStory } from '@/hooks/story/useDeleteStory';
import type { Story } from '@/types/story';

export const DeleteStoryModal = () => {
	const [selectedStory, setSelectedStory] = useAtom(selectedStoryStore);
	const [currentAction, setCurrentAction] = useAtom(currentStoryActionStore);

	const handleClose = () => {
		setCurrentAction(null);
	};

	return (
		<AlertDialog open={currentAction === 'delete'} onOpenChange={handleClose}>
			<AlertDialogContent onCloseAutoFocus={() => setSelectedStory(null)}>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
					{selectedStory && <DeleteButton story={selectedStory} />}
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

const DeleteButton = ({ story }: { story: Story }) => {
	const deleteStory = useDeleteStory({
		projectId: story.projectId,
	});

	const handleDelete = async () => {
		await deleteStory.mutateAsync(story.id);
	};

	return (
		<AlertDialogAction disabled={deleteStory.isPending} onClick={handleDelete}>
			Delete
		</AlertDialogAction>
	);
};
