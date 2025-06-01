import { Project } from '@/types/project';
import { StoryLocalStorageService } from './story';
import type { Story } from '@/types/story';

interface ProjectService {
	create(project: Omit<Project, 'id'>): Project;
	getOne(id: string): Project | undefined;
	getAll(): Project[];
	update(id: string, project: Omit<Project, 'id'>): Project | undefined;
	delete(id: string): Project | undefined;
}

export class ProjectLocalStorageService implements ProjectService {
	private readonly localStorageKey = 'projects';
	private readonly storyService = new StoryLocalStorageService();

	private createDefaultStories = (projectId: string) => {
		const defaultStories: Omit<Story, 'id'>[] = [
			{
				name: 'Default Story 1',
				description: 'Story description',
				priority: 'medium',
				createdAt: new Date().toISOString(),
				status: 'todo',
				projectId,
				userId: '1',
			},
			{
				name: 'Default Story 2',
				description: 'This is the second default story.',
				priority: 'low',
				createdAt: new Date().toISOString(),
				status: 'doing',
				projectId,
				userId: '1',
			},
			{
				name: 'Default Story 3',
				description: 'Story description',
				priority: 'low',
				createdAt: new Date().toISOString(),
				status: 'done',
				projectId,
				userId: '1',
			},
		];

		defaultStories.forEach((story) => {
			this.storyService.create(story);
		});
	};

	public create(project: Omit<Project, 'id'>) {
		const projects = this.getAll();

		const newProject = { id: String(projects.length + 1), ...project };
		localStorage.setItem(this.localStorageKey, JSON.stringify([...projects, newProject]));

		this.createDefaultStories(newProject.id);

		return newProject;
	}

	public getOne(id: string) {
		return this.getAll().find((project) => project.id === id);
	}

	public getAll(): Project[] {
		const data = localStorage.getItem(this.localStorageKey);
		return data ? JSON.parse(data) : [];
	}

	public update(id: string, project: Omit<Project, 'id'>) {
		const projects = this.getAll();
		const projectToUpdate = projects.find((p) => p.id === id);

		if (!projectToUpdate) {
			return undefined;
		}

		const updatedProject = { id, ...project };
		const updatedProjects = projects.map((p) => (p.id === id ? updatedProject : p));

		localStorage.setItem(this.localStorageKey, JSON.stringify(updatedProjects));

		return updatedProject;
	}

	public delete(id: string) {
		const projects = this.getAll();
		const projectToDelete = projects.find((project) => project.id === id);

		const updatedProjects = projects.filter((project) => project.id !== id);
		localStorage.setItem(this.localStorageKey, JSON.stringify(updatedProjects));

		if (projectToDelete) {
			this.storyService.getAllByProjectId(id).forEach((story) => {
				this.storyService.delete(story.id);
			});
		}

		return projectToDelete;
	}
}
