export type StoryStatus = 'todo' | 'doing' | 'done';
export type StoryPriority = 'low' | 'medium' | 'high';

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
