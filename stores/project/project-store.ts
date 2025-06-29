import { Project } from '@/types/project';
import { atom } from 'jotai';

export const selectedProjectStore = atom<null | Project>(null);

export const currentProjectActionStore = atom<'update' | 'delete' | null>(null);
