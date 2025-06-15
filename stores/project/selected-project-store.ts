import { Project } from '@/types/project';
import { atom } from 'jotai';

export const selectedProjectStore = atom<null | {
	action: 'update' | 'delete';
	project: Project;
}>(null);
