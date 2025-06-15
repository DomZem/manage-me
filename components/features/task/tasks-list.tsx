import { tasksAtom } from '@/stores/task/tasks-store';
import { useAtomValue } from 'jotai';
import { TaskCard } from './task-card';

export const TasksList = ({ storyId }: { storyId: string }) => {
	const tasks = useAtomValue(tasksAtom);

	const storyTasks = tasks.filter((task) => task.storyId === storyId);

	return (
		<ul className='space-y-2'>
			{storyTasks.map((task) => (
				<li key={task.id}>
					<TaskCard task={task} />
				</li>
			))}
		</ul>
	);
};
