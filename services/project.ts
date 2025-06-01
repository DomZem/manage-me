import { Project } from '@/types/project';

interface ProjectService {
	create(project: Omit<Project, 'id'>): Project;
	getOne(id: string): Project | undefined;
	getAll(): Project[];
	update(id: string, project: Omit<Project, 'id'>): Project | undefined;
	delete(id: string): Project | undefined;
}

export class ProjectLocalStorageService implements ProjectService {
	private readonly localStorageKey = 'projects';

	public create(project: Omit<Project, 'id'>) {
		const projects = this.getAll();

		const newProject = { id: String(projects.length + 1), ...project };
		localStorage.setItem(this.localStorageKey, JSON.stringify([...projects, newProject]));

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

		return projectToDelete;
	}
}
