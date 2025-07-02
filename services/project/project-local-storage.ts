import { v4 as uuidv4 } from 'uuid';
import { createProjectSchema, projectSchema } from '@/common/validation/project';
import { StoryLocalStorageService } from '../story/story-local-storage';
import { Project } from '@/types/project';

export interface IProjectService {
	getAll(): Project[];
	getOne(id: string): Project | undefined;
	create(project: Omit<Project, 'id'>): Project;
	update(updatedProject: Project): Project;
	delete(id: string): Project;
}

export class ProjectLocalStorageService implements IProjectService {
	private readonly localStorageKey = 'projects';

	private readonly storyService = new StoryLocalStorageService();

	// DONE
	public getAll(): Project[] {
		const data = localStorage.getItem(this.localStorageKey);

		if (!data) return [];

		try {
			const projects: unknown[] = JSON.parse(data);
			const parsedProjects: Project[] = [];

			for (const project of projects) {
				const parseResult = projectSchema.safeParse(project);

				if (!parseResult.success) {
					console.warn(`Skipping invalid project: ${parseResult.error.format()}`);
					continue;
				}

				parsedProjects.push(parseResult.data);
			}

			return parsedProjects;
		} catch (e) {
			console.error('error parsing tasks from localStorage:', e);
			return [];
		}
	}

	// DONE
	public getOne(id: string) {
		return this.getAll().find((project) => project.id === id);
	}

	// DONE
	public create(project: Omit<Project, 'id'>) {
		const parseResult = createProjectSchema.safeParse(project);

		if (!parseResult.success) {
			throw new Error(`Project is invalid: ${parseResult.error.format()}`);
		}

		const projects = this.getAll();

		const newProject = { id: uuidv4(), ...project };
		localStorage.setItem(this.localStorageKey, JSON.stringify([...projects, newProject]));

		return newProject;
	}

	// DONE
	public update(updatedProject: Project) {
		const parseResult = projectSchema.safeParse(updatedProject);

		if (!parseResult.success) {
			throw new Error(`Project is invalid: ${parseResult.error.format()}`);
		}

		const projectToUpdate = this.getOne(updatedProject.id);

		if (!projectToUpdate) {
			throw new Error(`Project with id ${updatedProject.id} does not exist`);
		}

		const updatedProjects = this.getAll().map((p) => (p.id === updatedProject.id ? updatedProject : p));

		localStorage.setItem(this.localStorageKey, JSON.stringify(updatedProjects));

		return updatedProject;
	}

	// DONE
	public delete(id: string) {
		const projectToDelete = this.getOne(id);

		if (!projectToDelete) {
			throw new Error(`Project with id ${id} does not exist`);
		}

		const updatedProjects = this.getAll().filter((project) => project.id !== id);
		localStorage.setItem(this.localStorageKey, JSON.stringify(updatedProjects));

		this.storyService.getAllByProjectId(id).forEach((story) => {
			this.storyService.delete(story.id);
		});

		return projectToDelete;
	}
}
