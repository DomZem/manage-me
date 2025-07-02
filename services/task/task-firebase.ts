import type { Task } from '@/types/task';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where, type DocumentData, type DocumentSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { taskCreateSchema, taskSchema } from '@/common/validation/task';

interface ITaskService {
	getAll(): Promise<Task[]>;
	getAllByStoryId(storyId: string): Promise<Task[]>;
	getOne(id: string): Promise<Task | undefined>;
	create(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task>;
	assignUserToTask(id: string, userId: string): Promise<Task>;
	markAsDone(id: string): Promise<Task>;
	update(updatedTask: Task): Promise<Task>;
	delete(id: string): Promise<Task>;
}

export class TaskFirebaseService implements ITaskService {
	private readonly collectionName = 'tasks';

	// DONE
	public async getAll(): Promise<Task[]> {
		const querySnapshot = await getDocs(collection(db, this.collectionName));

		const tasks: Task[] = [];

		for (const docSnap of querySnapshot.docs) {
			const parseResult = this.parseTask(docSnap);

			if (parseResult.success) {
				tasks.push(parseResult.data);
			} else {
				console.warn(`skipping invalid task [${docSnap.id}]`, parseResult.error.format());
			}
		}

		return tasks;
	}

	// DONE
	public async getAllByStoryId(storyId: string): Promise<Task[]> {
		const tasksRef = collection(db, this.collectionName);

		const q = query(tasksRef, where('storyId', '==', storyId));
		const querySnapshot = await getDocs(q);

		const tasks: Task[] = [];

		for (const docSnap of querySnapshot.docs) {
			const parseResult = this.parseTask(docSnap);

			if (parseResult.success) {
				tasks.push(parseResult.data);
			} else {
				console.warn(`skipping invalid task [${docSnap.id}]`, parseResult.error.format());
			}
		}

		return tasks;
	}

	// DONE
	public async getOne(id: string): Promise<Task | undefined> {
		const docRef = doc(db, this.collectionName, id);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) return undefined;

		const parseResult = this.parseTask(docSnap);

		if (!parseResult.success) {
			console.warn(`Task with id ${id} is invalid: ${parseResult.error.format()}`);
			return undefined;
		}

		return parseResult.data;
	}

	// DONE
	public async create(task: Omit<Task, 'id'>): Promise<Task> {
		const parseResult = taskCreateSchema.safeParse(task);

		if (!parseResult.success) {
			throw new Error(`Task is invalid: ${parseResult.error.format()}`);
		}

		const docRef = await addDoc(collection(db, this.collectionName), parseResult.data);

		return { id: docRef.id, ...parseResult.data };
	}

	// DONE
	public async assignUserToTask(id: string, userId: string): Promise<Task> {
		const docRef = doc(db, this.collectionName, id);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			throw new Error(`Task with id ${id} does not exist`);
		}

		const parseResult = this.parseTask(docSnap);

		if (!parseResult.success) {
			throw new Error(`Task with id ${id} is invalid: ${parseResult.error.format()}`);
		}

		if (parseResult.data.status !== 'todo') {
			throw new Error(`Task with id ${id} is not in 'todo' status`);
		}

		const updatedTask: Task = {
			...parseResult.data,
			status: 'doing',
			startedAt: new Date(),
			userId,
		};

		await setDoc(docRef, updatedTask, { merge: true });

		return updatedTask;
	}

	// DONE
	public async markAsDone(id: string): Promise<Task> {
		const docRef = doc(db, this.collectionName, id);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			throw new Error(`Task with id ${id} does not exist`);
		}

		const parseResult = this.parseTask(docSnap);

		if (!parseResult.success) {
			throw new Error(`Task with id ${id} is invalid: ${parseResult.error.format()}`);
		}

		if (parseResult.data.status !== 'doing') {
			throw new Error(`Task with id ${id} is not in 'doing' status`);
		}

		const updatedTask: Task = {
			...parseResult.data,
			status: 'done',
			finishedAt: new Date(),
		};

		await setDoc(docRef, updatedTask, { merge: true });

		return updatedTask;
	}

	// DONE
	public async update(updatedTask: Task): Promise<Task> {
		const parseResult = taskSchema.safeParse(updatedTask);

		if (!parseResult.success) {
			throw new Error(`Task is invalid: ${parseResult.error.format()}`);
		}

		const docRef = doc(db, this.collectionName, parseResult.data.id);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			throw new Error(`Task with id ${updatedTask.id} does not exist`);
		}

		await setDoc(docRef, parseResult.data, { merge: true });
		return parseResult.data;
	}

	// DONE
	public async delete(id: string): Promise<Task> {
		const docRef = doc(db, this.collectionName, id);
		const docSnap = await getDoc(docRef);

		const parseResult = this.parseTask(docSnap);

		if (!parseResult.success) {
			throw new Error(`Task with id ${id} is invalid: ${parseResult.error.format()}`);
		}

		if (!docSnap.exists()) {
			throw new Error(`Task with id ${id} does not exist`);
		}

		await deleteDoc(docRef);

		return parseResult.data;
	}

	private parseTask(docSnap: DocumentSnapshot<DocumentData, DocumentData>) {
		const rawData = docSnap.data();
		const task = {
			id: docSnap.id,
			...rawData,
			createdAt: rawData?.createdAt?.toDate?.() ?? new Date(),
			startedAt: rawData?.startedAt?.toDate?.() ?? null,
			finishedAt: rawData?.finishedAt?.toDate?.() ?? null,
		};

		const result = taskSchema.safeParse(task);

		return result;
	}
}
