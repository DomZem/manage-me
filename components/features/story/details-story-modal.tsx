'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { selectedStoryStore } from '@/stores/story/selected-story-store';
import { useAtom } from 'jotai';
import { TasksList } from '../task/tasks-list';
import { CreateTaskModal } from '../task/create-task-modal';

export const DetailsStoryModal = () => {
	const [selectedStory, setSelectedStory] = useAtom(selectedStoryStore);

	const handleClose = () => {
		setSelectedStory(null);
	};

	return (
		<Dialog open={selectedStory?.action === 'details'} onOpenChange={handleClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{selectedStory?.story ? (
							<>
								Details of <span className='font-semibold'>{selectedStory.story.name}</span> story
							</>
						) : (
							'Story Details'
						)}
					</DialogTitle>
					<DialogDescription>{selectedStory?.story ? selectedStory.story.description : 'Here you can see the details of the story and its tasks.'}</DialogDescription>
				</DialogHeader>

				{selectedStory?.story && (
					<>
						<TasksList storyId={selectedStory.story.id} />
						<CreateTaskModal storyId={selectedStory.story.id} />
					</>
				)}
			</DialogContent>
		</Dialog>
	);
};
