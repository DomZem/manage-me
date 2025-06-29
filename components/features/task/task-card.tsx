import { Card } from '@/components/ui/card';
import type { Task } from '@/types/task';
import { CircleCheck, CircleDot, Loader } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AssignUserToTask } from './assign-user-to-task';
import { TaskCardOptions } from './task-card-options';

export const TaskCard = ({ task }: { task: Task }) => {
	return (
		<Card className='rounded-lg p-4 bg-sidebar'>
			<div className='flex justify-between items-start gap-4'>
				<div className='flex-1'>
					<div className='flex items-center gap-2'>
						{task.status === 'todo' ? (
							<CircleDot className='text-purple-600' size={16} />
						) : task.status === 'doing' ? (
							<Loader className='text-orange-600' size={16} />
						) : (
							<CircleCheck className='text-green-600' size={16} />
						)}
						<p className='text-sm font-medium'>{task.name}</p>
					</div>

					<p className='text-xs text-muted-foreground mt-1'>{task.description}</p>

					<div className='flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground'>
						<span>
							Priority: <strong className='capitalize'>{task.priority}</strong>
						</span>
						{/* <span>Created: {task.createdAt.toLocaleDateString()}</span> */}
						{'startedAt' in task && <span>Started: {task.startedAt.toLocaleDateString()}</span>}
						{'finishedAt' in task && <span>Finished: {task.finishedAt.toLocaleDateString()}</span>}
						<span>ETA: {task.elapsedTimeToFinish}h</span>
					</div>
				</div>

				<div className='inline-flex items-center gap-2'>
					{task.status === 'todo' ? (
						<AssignUserToTask taskId={task.id} storyId={task.storyId} />
					) : (
						<Avatar className='size-9'>
							<AvatarImage src='https://github.com/shadcn.png' />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
					)}
					<TaskCardOptions task={task} />
				</div>
			</div>
		</Card>
	);
};
