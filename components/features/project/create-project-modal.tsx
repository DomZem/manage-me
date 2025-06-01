'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreateProjectForm } from './create-project-form';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const CreateProjectModal = () => {
	const [isOpen, setIsOpen] = useState(false);

	const handleClose = () => {
		setIsOpen(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<Button onClick={() => setIsOpen(true)}>Create new</Button>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create new project</DialogTitle>
					<DialogDescription>To create a new project, please provide a name and a description.</DialogDescription>
				</DialogHeader>
				<CreateProjectForm onSuccess={handleClose} />
			</DialogContent>
		</Dialog>
	);
};
