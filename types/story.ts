export enum StoryStatus {
	Todo = 'todo',
	Doing = 'doing',
	Done = 'done',
}

export enum StoryPriority {
	Low = 'low',
	Medium = 'medium',
	High = 'high',
}

export interface Story {
	id: string;
	name: string;
	description: string;
	priority: StoryPriority;
	createdAt: string;
	status: StoryStatus;
	projectId: string;
	userId: string;
}
