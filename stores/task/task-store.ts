import type { Task } from '@/types/task';
import { atom } from 'jotai';

export const selectedTaskStore = atom<null | Task>(null);

export const currentTaskActionStore = atom<'update' | 'delete' | null>(null);
