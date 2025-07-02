import { collection, getDocs, getDoc, doc, addDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { createProjectSchema, projectSchema } from '@/common/validation/project';
import type { Project } from '@/types/project';
import { db } from '@/lib/firebase';

export interface IProjectService {
	getAll(): Promise<Project[]>;
	getOne(id: string): Promise<Project | undefined>;
	create(project: Omit<Project, 'id'>): Promise<Project>;
	update(updatedProject: Project): Promise<Project>;
	delete(id: string): Promise<Project>;
}

export class ProjectFirebaseService implements IProjectService {
	private readonly collectionName = 'projects';

	// DONE
	public async getAll(): Promise<Project[]> {
		const querySnapshot = await getDocs(collection(db, this.collectionName));

		const projects: Project[] = [];

		for (const docSnap of querySnapshot.docs) {
			const data = { id: docSnap.id, ...docSnap.data() };

			const parseResult = projectSchema.safeParse(data);

			if (parseResult.success) {
				projects.push(parseResult.data);
			} else {
				console.warn(`Skipping invalid project [${docSnap.id}]`, parseResult.error.format());
			}
		}

		return projects;
	}

	public async getOne(id: string): Promise<Project | undefined> {
		const docRef = doc(db, this.collectionName, id);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) return undefined;

		const project = { id: docSnap.id, ...docSnap.data() };
		const parseResult = projectSchema.safeParse(project);

		if (!parseResult.success) {
			console.warn(`Project with id ${id} is invalid: ${parseResult.error.format()}`);
			return undefined;
		}

		return parseResult.data;
	}

	// DONE
	public async create(project: Omit<Project, 'id'>): Promise<Project> {
		const parseResult = createProjectSchema.safeParse(project);

		if (!parseResult.success) {
			throw new Error(`Project is invalid: ${parseResult.error.format()}`);
		}

		const docRef = await addDoc(collection(db, this.collectionName), parseResult.data);

		return { id: docRef.id, ...parseResult.data };
	}

	// DONE
	public async update(updatedProject: Project): Promise<Project> {
		const parseResult = projectSchema.safeParse(updatedProject);

		if (!parseResult.success) {
			throw new Error(`Project is invalid: ${parseResult.error.format()}`);
		}

		const docRef = doc(db, this.collectionName, parseResult.data.id);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			throw new Error(`Project with id ${updatedProject.id} does not exist`);
		}

		await setDoc(docRef, parseResult.data, { merge: true });
		return parseResult.data;
	}

	// DONE
	public async delete(id: string): Promise<Project> {
		const docRef = doc(db, this.collectionName, id);
		const docSnap = await getDoc(docRef);

		const projectToDelete = { id: docSnap.id, ...docSnap.data() };

		const parseResult = projectSchema.safeParse(projectToDelete);

		if (!parseResult.success) {
			throw new Error(`Project with id ${id} is invalid: ${parseResult.error.format()}`);
		}

		if (!docSnap.exists()) {
			throw new Error(`Project with id ${id} does not exist`);
		}

		await deleteDoc(docRef);

		return parseResult.data;
	}
}
