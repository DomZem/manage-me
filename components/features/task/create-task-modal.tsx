import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreateTaskForm } from './create-task-form';

export const CreateTaskModal = ({ storyId }: { storyId: string }) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Add new</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create new</DialogTitle>
					<DialogDescription>Fill out the form below to create a new task for your story.</DialogDescription>
				</DialogHeader>

				<CreateTaskForm storyId={storyId} />
			</DialogContent>
		</Dialog>
	);
};
