import type { Story } from '@/types/story';
import { atom } from 'jotai';

export const selectedStoryStore = atom<null | {
	action: 'update' | 'delete' | 'details';
	story: Story;
}>(null);
