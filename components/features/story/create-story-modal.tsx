'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { StoryForm } from './story-form';
import { useCreateStory } from '@/hooks/story/useCreateStory';

export const CreateStoryModal = ({ projectId, userId }: { projectId: string; userId: string }) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleClose = () => {
		setIsOpen(false);
	};

	const createStory = useCreateStory({
		projectId,
		onSuccess: () => {
			handleClose();
		},
	});

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<Button onClick={() => setIsOpen(true)}>Create new</Button>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create new story</DialogTitle>
					<DialogDescription>Fill out the form below to create a new story for your project.</DialogDescription>
				</DialogHeader>

				<StoryForm
					variant='create'
					projectId={projectId}
					userId={userId}
					isSubmitting={createStory.isPending}
					onSubmit={async (data) => {
						await createStory.mutateAsync(data);
					}}
				/>
			</DialogContent>
		</Dialog>
	);
};
