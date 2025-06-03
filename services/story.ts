import type { Story } from '@/types/story';
import { v4 as uuidv4 } from 'uuid';

interface StoryService {
	getAll(): Story[];
	getAllByProjectId(projectId: string): Story[];
	getOne(id: string): Story | undefined;
	create(story: Omit<Story, 'id' | 'createdAt'>): Story;
	update(id: string, story: Omit<Story, 'id' | 'createdAt'>): Story | undefined;
	delete(id: string): Story | undefined;
}

export class StoryLocalStorageService implements StoryService {
	private readonly localStorageKey = 'stories';

	public getAll(): Story[] {
		const data = localStorage.getItem(this.localStorageKey);
		return data ? JSON.parse(data) : [];
	}

	public getOne(id: string) {
		return this.getAll().find((story) => story.id === id);
	}

	public getAllByProjectId(projectId: string): Story[] {
		return this.getAll().filter((story) => story.projectId === projectId);
	}

	public create(story: Omit<Story, 'id' | 'createdAt'>) {
		const stories = this.getAll();

		const newStory = { ...story, id: uuidv4(), createdAt: new Date().toISOString() };
		localStorage.setItem(this.localStorageKey, JSON.stringify([...stories, newStory]));

		return newStory;
	}

	public update(id: string, story: Omit<Story, 'id' | 'createdAt'>) {
		const stories = this.getAll();

		const storyToUpdate = stories.find((story) => story.id === id);

		if (!storyToUpdate) {
			return undefined;
		}

		const updatedStory = { id, ...story };
		const updatedStories = stories.map((p) => (p.id === id ? updatedStory : p));

		localStorage.setItem(this.localStorageKey, JSON.stringify(updatedStories));

		return updatedStory;
	}

	public delete(id: string) {
		const stories = this.getAll();
		const storyToDelete = stories.find((story) => story.id === id);

		const updatedStories = stories.filter((story) => story.id !== id);
		localStorage.setItem(this.localStorageKey, JSON.stringify(updatedStories));

		return storyToDelete;
	}
}
