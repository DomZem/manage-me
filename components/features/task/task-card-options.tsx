import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { TaskLocalStorageService } from '@/services/task';
import { selectedTaskStore } from '@/stores/task/selected-task-store';
import { refreshTasksAtom } from '@/stores/task/tasks-store';
import type { Task } from '@/types/task';
import { useSetAtom } from 'jotai';
import { Ellipsis, SquareCheckBig, SquarePen, Trash2 } from 'lucide-react';

export const TaskCardOptions = ({ task }: { task: Task }) => {
	const { toast } = useToast();

	const refreshTasks = useSetAtom(refreshTasksAtom);
	const setSelectedTask = useSetAtom(selectedTaskStore);

	const handleMarkAsDone = () => {
		const taskService = new TaskLocalStorageService();

		try {
			taskService.markAsDone(task.id);

			toast({
				title: 'Task marked as done',
				description: (
					<p>
						Sucessfully marked <span className='font-medium'>{task.name}</span> as done
					</p>
				),
			});

			refreshTasks();
		} catch (error) {
			console.error('Error marking task as done:', error);

			toast({
				title: 'Error',
				description: 'Failed to mark task as done.',
				variant: 'destructive',
			});
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					onClick={(e) => {
						e.stopPropagation();
					}}
					variant='ghost'
					className='p-1 size-5'
				>
					<Ellipsis />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent>
				<DropdownMenuItem asChild>
					<Button
						className='w-full justify-start cursor-pointer'
						variant='ghost'
						onClick={(e) => {
							e.stopPropagation();
							// setSelectedStory({ action: 'update', story });
						}}
					>
						<SquarePen />
						Update
					</Button>
				</DropdownMenuItem>

				{task.status === 'doing' && (
					<DropdownMenuItem asChild>
						<Button className='w-full justify-start cursor-pointer' variant='ghost' onClick={handleMarkAsDone}>
							<SquareCheckBig />
							Mark as Done
						</Button>
					</DropdownMenuItem>
				)}

				<DropdownMenuItem asChild>
					<Button
						className='w-full justify-start cursor-pointer'
						variant='ghost'
						onClick={(e) => {
							e.stopPropagation();
							setSelectedTask({ action: 'delete', task });
						}}
					>
						<Trash2 />
						Delete
					</Button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
