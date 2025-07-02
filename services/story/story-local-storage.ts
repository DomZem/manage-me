import { createStorySchema, storySchema } from '@/common/validation/story';
import type { Story } from '@/types/story';
import { v4 as uuidv4 } from 'uuid';

interface IStoryService {
	getAll(): Story[];
	getAllByProjectId(projectId: string): Story[];
	getOne(id: string): Story | undefined;
	create(story: Omit<Story, 'id'>): Story;
	update(updatedStory: Story): Story;
	delete(id: string): Story;
}

export class StoryLocalStorageService implements IStoryService {
	private readonly localStorageKey = 'stories';

	// DONE
	public getAll(): Story[] {
		const data = localStorage.getItem(this.localStorageKey);
		if (!data) return [];

		try {
			const stories: unknown[] = JSON.parse(data);
			const parsedStories: Story[] = [];

			for (const story of stories) {
				const parseResult = storySchema.safeParse(story);

				if (!parseResult.success) {
					console.warn(`Skipping invalid story: ${parseResult.error.format()}`);
					continue;
				}

				parsedStories.push(parseResult.data);
			}

			return parsedStories;
		} catch (e) {
			console.error('error parsing stories from localStorage:', e);

			return [];
		}
	}

	// DONE
	public getOne(id: string) {
		return this.getAll().find((story) => story.id === id);
	}

	// DONE
	public getAllByProjectId(projectId: string): Story[] {
		return this.getAll().filter((story) => story.projectId === projectId);
	}

	// DONE
	public create(story: Omit<Story, 'id'>) {
		const parseResult = createStorySchema.safeParse(story);

		if (!parseResult.success) {
			throw new Error(`Story is invalid: ${parseResult.error.format()}`);
		}

		const stories = this.getAll();

		const newStory = { ...story, id: uuidv4() };
		localStorage.setItem(this.localStorageKey, JSON.stringify([...stories, newStory]));

		return newStory;
	}

	// DONE
	public update(updatedStory: Story) {
		const parseResult = storySchema.safeParse(updatedStory);

		if (!parseResult.success) {
			throw new Error(`Story is invalid: ${parseResult.error.format()}`);
		}

		const storyToUpdate = this.getOne(updatedStory.id);

		if (!storyToUpdate) {
			throw new Error(`Story with id ${updatedStory.id} does not exist`);
		}

		const updatedStories = this.getAll().map((p) => (p.id === updatedStory.id ? updatedStory : p));

		localStorage.setItem(this.localStorageKey, JSON.stringify(updatedStories));

		return updatedStory;
	}

	// DONE
	public delete(id: string) {
		const storyToDelete = this.getOne(id);

		if (!storyToDelete) {
			throw new Error(`Story with id ${id} does not exist`);
		}

		const updatedStories = this.getAll().filter((story) => story.id !== id);
		localStorage.setItem(this.localStorageKey, JSON.stringify(updatedStories));

		return storyToDelete;
	}
}
