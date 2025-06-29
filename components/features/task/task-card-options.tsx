import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useMarkTaskAsDone } from '@/hooks/task/useMarkTaskAsDone';
import { currentTaskActionStore, selectedTaskStore } from '@/stores/task/task-store';
import type { Task } from '@/types/task';
import { useSetAtom } from 'jotai';
import { Ellipsis, SquareCheckBig, SquarePen, Trash2 } from 'lucide-react';

export const TaskCardOptions = ({ task }: { task: Task }) => {
	const setSelectedTask = useSetAtom(selectedTaskStore);
	const setCurrentAction = useSetAtom(currentTaskActionStore);

	const markTaskAsDone = useMarkTaskAsDone({
		storyId: task.storyId,
	});

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
							setSelectedTask(task);
							setCurrentAction('update');
						}}
					>
						<SquarePen />
						Update
					</Button>
				</DropdownMenuItem>

				{task.status === 'doing' && (
					<DropdownMenuItem asChild>
						<Button
							disabled={markTaskAsDone.isPending}
							className='w-full justify-start cursor-pointer'
							variant='ghost'
							onClick={async () => {
								await markTaskAsDone.mutateAsync(task.id);
							}}
						>
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
							setSelectedTask(task);
							setCurrentAction('delete');
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
