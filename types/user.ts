export type UserRole = 'admin' | 'devops' | 'developer';

export interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	image?: string | null;
	role: UserRole;
}
