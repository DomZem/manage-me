import type { Task } from '@/types/task';
import { atom } from 'jotai';

export const selectedTaskStore = atom<null | {
	action: 'update' | 'delete';
	task: Task;
}>(null);
