import { ProjectLocalStorageService } from '@/services/project/project-local-storage';
import { Project } from '@/types/project';
import { atom } from 'jotai';

const projectService = new ProjectLocalStorageService();

export const projectsAtom = atom<Project[]>(projectService.getAll());

export const refreshProjectsAtom = atom(null, (_get, set) => {
	const updatedProjects = projectService.getAll();
	set(projectsAtom, updatedProjects);
});
