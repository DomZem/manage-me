'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { currentStoryActionStore, selectedStoryStore } from '@/stores/story/story-store';
import { useAtom } from 'jotai';
import { TasksList } from '../task/tasks-list';
import { CreateTaskForm } from '../task/create-task-form';

export const DetailsStoryModal = () => {
	const [selectedStory, setSelectedStory] = useAtom(selectedStoryStore);
	const [currentAction, setCurrentAction] = useAtom(currentStoryActionStore);

	const handleClose = () => {
		setCurrentAction(null);
	};

	return (
		<Dialog open={currentAction === 'details'} onOpenChange={handleClose}>
			<DialogContent className='max-w-3xl' onCloseAutoFocus={() => setSelectedStory(null)}>
				<DialogHeader>
					<DialogTitle>
						Details of <span className='font-semibold'>{selectedStory?.name}</span> story
					</DialogTitle>
					<DialogDescription>{selectedStory?.description}</DialogDescription>
				</DialogHeader>

				{selectedStory && (
					<div className='flex gap-4'>
						<TasksList storyId={selectedStory.id} />
						<CreateTaskForm storyId={selectedStory.id} />
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};
