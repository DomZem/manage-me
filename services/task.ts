import type { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { taskSchema } from '@/common/validation/task';

type Task = z.infer<typeof taskSchema>;

interface TaskService {
	getAll(): Task[];
	getAllByStoryId(storyId: string): Task[];
	getOne(id: string): Task | undefined;
	create(task: Omit<Task, 'id' | 'createdAt'>): Task;
	assignUserToTask(taskId: string, userId: string): Task;
	markAsDone(taskId: string): Task;
	update(id: string, task: Omit<Task, 'id' | 'createdAt'>): Task | undefined;
	delete(id: string): Task | undefined;
}

export class TaskLocalStorageService implements TaskService {
	private readonly localStorageKey = 'tasks';

	public getAll(): Task[] {
		const data = localStorage.getItem(this.localStorageKey);

		if (!data) return [];

		try {
			const tasks: unknown[] = JSON.parse(data);
			return tasks.map((t) => taskSchema.parse(t));
		} catch (e) {
			console.error('Error parsing tasks from localStorage:', e);

			return [];
		}
	}

	public getAllByStoryId(storyId: string): Task[] {
		return this.getAll().filter((task) => task.storyId === storyId);
	}

	public getOne(id: string): Task | undefined {
		return this.getAll().find((task) => task.id === id);
	}

	public create(task: Omit<Task, 'id' | 'createdAt'>): Task {
		const tasks = this.getAll();

		const newTask: Task = taskSchema.parse({
			...task,
			id: uuidv4(),
			createdAt: new Date(),
		});
		localStorage.setItem(this.localStorageKey, JSON.stringify([...tasks, newTask]));

		return newTask;
	}

	public update(id: string, task: Omit<Task, 'id' | 'createdAt'>): Task | undefined {
		const tasks = this.getAll();
		const taskToUpdate = tasks.find((t) => t.id === id);
		if (!taskToUpdate) return undefined;

		const updatedTask: Task = taskSchema.parse({
			...task,
			id,
			createdAt: taskToUpdate.createdAt, // preserve createdAt
		});
		const updatedTasks = tasks.map((t) => (t.id === id ? updatedTask : t));
		localStorage.setItem(this.localStorageKey, JSON.stringify(updatedTasks));
		return updatedTask;
	}

	public assignUserToTask(taskId: string, userId: string): Task {
		const tasks = this.getAll();
		const taskToUpdate = tasks.find((t) => t.id === taskId);

		if (!taskToUpdate) {
			throw new Error(`Task with id ${taskId} not found`);
		}

		if (taskToUpdate.status !== 'todo') {
			throw new Error('Task must be in "todo" status to assign a user');
		}

		const updatedTask: Task = taskSchema.parse({
			...taskToUpdate,
			status: 'doing',
			userId,
			startedAt: new Date(),
		});

		const updatedTasks = tasks.map((task) => (task.id === taskId ? updatedTask : task));
		localStorage.setItem(this.localStorageKey, JSON.stringify(updatedTasks));
		return updatedTask;
	}

	public markAsDone(taskId: string): Task {
		const tasks = this.getAll();
		const taskToUpdate = tasks.find((t) => t.id === taskId);

		if (!taskToUpdate) {
			throw new Error(`Task with id ${taskId} not found`);
		}

		if (taskToUpdate.status !== 'doing') {
			throw new Error('Task must be in "doing" status to be marked as done');
		}

		const updatedTask: Task = taskSchema.parse({
			...taskToUpdate,
			status: 'done',
			finishedAt: new Date(),
		});

		const updatedTasks = tasks.map((task) => (task.id === taskId ? updatedTask : task));
		localStorage.setItem(this.localStorageKey, JSON.stringify(updatedTasks));
		return updatedTask;
	}

	public delete(id: string): Task | undefined {
		const tasks = this.getAll();
		const taskToDelete = tasks.find((t) => t.id === id);
		const updatedTasks = tasks.filter((t) => t.id !== id);
		localStorage.setItem(this.localStorageKey, JSON.stringify(updatedTasks));
		return taskToDelete;
	}
}
