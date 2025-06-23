'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCreateProject } from '@/hooks/project/useCreateProject';
import { Button } from '@/components/ui/button';
import { ProjectForm } from './project-form';
import { useState } from 'react';

export const CreateProjectModal = () => {
	const [isOpen, setIsOpen] = useState(false);

	const handleClose = () => {
		setIsOpen(false);
	};

	const createProject = useCreateProject({
		onSuccess: () => {
			handleClose();
		},
	});

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<Button onClick={() => setIsOpen(true)}>Create new</Button>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create new project</DialogTitle>
					<DialogDescription>To create a new project, please provide a name and a description.</DialogDescription>
				</DialogHeader>

				<ProjectForm
					variant='create'
					isSubmitting={createProject.isPending}
					onSubmit={async (data) => {
						await createProject.mutateAsync(data);
					}}
				/>
			</DialogContent>
		</Dialog>
	);
};
