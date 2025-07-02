import { createStorySchema, storySchema } from '@/common/validation/story';
import { db } from '@/lib/firebase';
import type { Story } from '@/types/story';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';

interface IStoryService {
	getAll(): Promise<Story[]>;
	getAllByProjectId(projectId: string): Promise<Story[]>;
	getOne(id: string): Promise<Story | undefined>;
	create(story: Omit<Story, 'id'>): Promise<Story>;
	update(updatedStory: Story): Promise<Story>;
	delete(id: string): Promise<Story>;
}

export class StoryFirebaseService implements IStoryService {
	private readonly collectionName = 'stories';

	// DONE
	public async getAll(): Promise<Story[]> {
		const querySnapshot = await getDocs(collection(db, this.collectionName));

		const stories: Story[] = [];

		for (const docSnap of querySnapshot.docs) {
			const data = { id: docSnap.id, ...docSnap.data() };

			const parseResult = storySchema.safeParse(data);

			if (parseResult.success) {
				stories.push(parseResult.data);
			} else {
				console.warn(`skipping invalid story [${docSnap.id}]`, parseResult.error.format());
			}
		}

		return stories;
	}

	// DONE
	public async getAllByProjectId(projectId: string): Promise<Story[]> {
		const storiesRef = collection(db, this.collectionName);

		const q = query(storiesRef, where('projectId', '==', projectId));
		const querySnapshot = await getDocs(q);

		const stories: Story[] = [];

		for (const docSnap of querySnapshot.docs) {
			const data = { id: docSnap.id, ...docSnap.data() };

			const parseResult = storySchema.safeParse(data);

			if (parseResult.success) {
				stories.push(parseResult.data);
			} else {
				console.warn(`skipping invalid story [${docSnap.id}]`, parseResult.error.format());
			}
		}

		return stories;
	}

	// DONE
	public async getOne(id: string): Promise<Story | undefined> {
		const docRef = doc(db, this.collectionName, id);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) return undefined;

		const project = { id: docSnap.id, ...docSnap.data() };
		const parseResult = storySchema.safeParse(project);

		if (!parseResult.success) {
			console.warn(`Story with id ${id} is invalid: ${parseResult.error.format()}`);
			return undefined;
		}

		return parseResult.data;
	}

	// DONE
	public async create(story: Omit<Story, 'id'>): Promise<Story> {
		const parseResult = createStorySchema.safeParse(story);

		if (!parseResult.success) {
			throw new Error(`Story is invalid: ${parseResult.error.format()}`);
		}

		const docRef = await addDoc(collection(db, this.collectionName), parseResult.data);

		return { id: docRef.id, ...parseResult.data };
	}

	// DONE
	public async update(updatedStory: Story): Promise<Story> {
		const parseResult = storySchema.safeParse(updatedStory);

		if (!parseResult.success) {
			throw new Error(`Story is invalid: ${parseResult.error.format()}`);
		}

		const docRef = doc(db, this.collectionName, parseResult.data.id);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			throw new Error(`Story with id ${updatedStory.id} does not exist`);
		}

		await setDoc(docRef, parseResult.data, { merge: true });
		return parseResult.data;
	}

	// DONE
	public async delete(id: string): Promise<Story> {
		const docRef = doc(db, this.collectionName, id);
		const docSnap = await getDoc(docRef);

		const storyToDelete = { id: docSnap.id, ...docSnap.data() };

		const parseResult = storySchema.safeParse(storyToDelete);

		if (!parseResult.success) {
			throw new Error(`Story with id ${id} is invalid: ${parseResult.error.format()}`);
		}

		if (!docSnap.exists()) {
			throw new Error(`Story with id ${id} does not exist`);
		}

		await deleteDoc(docRef);

		return parseResult.data;
	}
}
