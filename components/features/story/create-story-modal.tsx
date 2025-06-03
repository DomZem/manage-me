'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { CreateStoryForm } from './create-story-form';

export const CreateStoryModal = ({ projectId }: { projectId: string }) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleClose = () => {
		setIsOpen(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<Button onClick={() => setIsOpen(true)}>Create new</Button>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create new story</DialogTitle>
					<DialogDescription>Fill out the form below to create a new story for your project.</DialogDescription>
				</DialogHeader>

				<CreateStoryForm onSuccess={handleClose} projectId={projectId} />
			</DialogContent>
		</Dialog>
	);
};
