import { TaskLocalStorageService } from '@/services/task/task-local-storage';
import { atom } from 'jotai';

const taskService = new TaskLocalStorageService();

export const tasksAtom = atom(taskService.getAll());

export const refreshTasksAtom = atom([], (_get, set) => {
	const updatedStories = taskService.getAll();
	set(tasksAtom, updatedStories);
});
