import type { Story } from '@/types/story';

interface StoryService {
	getAll(): Story[];
	getAllByProjectId(projectId: string): Story[];
	getOne(id: string): Story | undefined;
	create(story: Omit<Story, 'id'>): Story;
	update(id: string, story: Omit<Story, 'id'>): Story | undefined;
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

	public create(story: Omit<Story, 'id'>) {
		const stories = this.getAll();

		const newStory = { id: String(stories.length + 1), ...story };
		localStorage.setItem(this.localStorageKey, JSON.stringify([...stories, newStory]));

		return newStory;
	}

	public update(id: string, story: Omit<Story, 'id'>) {
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
