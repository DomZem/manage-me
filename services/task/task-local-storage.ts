import { v4 as uuidv4 } from 'uuid';
import { taskCreateSchema, taskSchema } from '@/common/validation/task';
import type { Task } from '@/types/task';

interface ITaskService {
	getAll(): Task[];
	getAllByStoryId(storyId: string): Task[];
	getOne(id: string): Task | undefined;
	create(task: Omit<Task, 'id' | 'createdAt'>): Task;
	assignUserToTask(id: string, userId: string): Task;
	markAsDone(id: string): Task;
	update(updatedTask: Task): Task;
	delete(id: string): Task;
}

export class TaskLocalStorageService implements ITaskService {
	private readonly localStorageKey = 'tasks';

	// DONE
	public getAll(): Task[] {
		const data = localStorage.getItem(this.localStorageKey);

		if (!data) return [];

		try {
			const tasks: unknown[] = JSON.parse(data);
			const parsedTasks: Task[] = [];

			for (const task of tasks) {
				const parseResult = taskSchema.safeParse(task);

				if (!parseResult.success) {
					console.warn(`Skipping invalid task: ${parseResult.error.format()}`);
					continue;
				}

				parsedTasks.push(parseResult.data);
			}

			return parsedTasks;
		} catch (e) {
			console.error('Error parsing tasks from localStorage:', e);
			return [];
		}
	}

	// DONE
	public getAllByStoryId(storyId: string): Task[] {
		return this.getAll().filter((task) => task.storyId === storyId);
	}

	// DONE
	public getOne(id: string): Task | undefined {
		const task = this.getAll().find((task) => task.id === id);

		if (!task) {
			console.warn(`Task with id ${id} not found`);
			return undefined;
		}

		const parseResult = taskSchema.safeParse(task);

		if (!parseResult.success) {
			throw new Error(`Task is invalid: ${parseResult.error.format()}`);
		}

		return parseResult.data;
	}

	// DONE
	public create(task: Omit<Task, 'id' | 'createdAt'>): Task {
		const parseResult = taskCreateSchema.safeParse(task);

		if (!parseResult.success) {
			throw new Error(`Task is invalid: ${parseResult.error.format()}`);
		}

		const tasks = this.getAll();

		const newTask: Task = {
			...parseResult.data,
			id: uuidv4(),
			createdAt: new Date(),
		};
		localStorage.setItem(this.localStorageKey, JSON.stringify([tasks, newTask]));

		return newTask;
	}

	public update(updatedTask: Task): Task {
		const parseResult = taskSchema.safeParse(updatedTask);

		if (!parseResult.success) {
			throw new Error(`Task is invalid: ${parseResult.error.format()}`);
		}

		const taskToUpdate = this.getOne(updatedTask.id);

		if (!taskToUpdate) {
			throw new Error(`Task with id ${updatedTask.id} does not exist`);
		}

		const updatedTasks = this.getAll().map((task) => (task.id === updatedTask.id ? updatedTask : task));
		localStorage.setItem(this.localStorageKey, JSON.stringify(updatedTasks));

		return updatedTask;
	}

	// DONE
	public assignUserToTask(id: string, userId: string): Task {
		const taskToUpdate = this.getOne(id);

		if (!taskToUpdate) {
			throw new Error(`Task with id ${id} does not exist`);
		}

		if (taskToUpdate.status !== 'todo') {
			throw new Error(`Task with id ${id} is not in 'todo' status`);
		}

		const updatedTask: Task = {
			...taskToUpdate,
			status: 'doing',
			userId,
			startedAt: new Date(),
		};

		const updatedTasks = this.getAll().map((task) => (task.id === updatedTask.id ? updatedTask : task));
		localStorage.setItem(this.localStorageKey, JSON.stringify(updatedTasks));

		return updatedTask;
	}

	// DONE
	public markAsDone(id: string): Task {
		const taskToUpdate = this.getOne(id);

		if (!taskToUpdate) {
			throw new Error(`Task with id ${id} does not exist`);
		}

		if (taskToUpdate.status !== 'doing') {
			throw new Error(`Task with id ${id} is not in 'doing' status`);
		}

		const updatedTask: Task = {
			...taskToUpdate,
			status: 'done',
			finishedAt: new Date(),
		};

		const updatedTasks = this.getAll().map((task) => (task.id === updatedTask.id ? updatedTask : task));
		localStorage.setItem(this.localStorageKey, JSON.stringify(updatedTasks));

		return updatedTask;
	}

	// DONE
	public delete(id: string): Task {
		const taskToDelete = this.getOne(id);

		if (!taskToDelete) {
			throw new Error(`Task with id ${id} does not exist`);
		}

		const updatedTasks = this.getAll().filter((task) => task.id !== id);
		localStorage.setItem(this.localStorageKey, JSON.stringify(updatedTasks));

		return taskToDelete;
	}
}
