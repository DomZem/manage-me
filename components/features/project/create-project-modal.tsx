import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreateProjectForm } from './create-project-form';
import { Button } from '@/components/ui/button';

export const CreateProjectModal = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Create new</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create new project</DialogTitle>
					<DialogDescription>To create a new project, please provide a name and a description.</DialogDescription>
				</DialogHeader>
				<CreateProjectForm />
			</DialogContent>
		</Dialog>
	);
};
