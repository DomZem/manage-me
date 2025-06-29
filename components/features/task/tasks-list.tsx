import { useStoryTasks } from '@/hooks/task/useStoryTasks';
import { TaskCard } from './task-card';
import { CircleOff } from 'lucide-react';

export const TasksList = ({ storyId }: { storyId: string }) => {
	const { data: storyTasks, isLoading } = useStoryTasks({
		storyId,
	});

	if (isLoading) {
		return <div>Loading tasks...</div>;
	}

	if (!storyTasks || storyTasks.length === 0) {
		return (
			<div className='border p-4 flex items-center justify-center rounded-md bg-sidebar'>
				<div className='inline-flex flex-col items-center gap-2'>
					<CircleOff />
					<p className='text-foreground font-semibold'>Empty tasks</p>
					<p className='text-muted-foreground text-sm font-medium'>Use form below to create a new task.</p>
				</div>
			</div>
		);
	}

	return (
		<ul className='space-y-2 flex-1'>
			{storyTasks.map((task) => (
				<li key={task.id}>
					<TaskCard task={task} />
				</li>
			))}
		</ul>
	);
};
