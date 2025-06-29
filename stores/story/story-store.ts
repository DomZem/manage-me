import type { Story } from '@/types/story';
import { atom } from 'jotai';

export const selectedStoryStore = atom<null | Story>(null);

export const currentStoryActionStore = atom<'update' | 'delete' | 'details' | null>(null);
