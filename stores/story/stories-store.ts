import { StoryLocalStorageService } from '@/services/story/story-local-storage';
import type { Story } from '@/types/story';
import { atom } from 'jotai';

const storyService = new StoryLocalStorageService();

export const storiesAtom = atom<Story[]>(storyService.getAll());

export const refreshStoriesAtom = atom([], (_get, set) => {
	const updatedStories = storyService.getAll();
	set(storiesAtom, updatedStories);
});
