import { User } from '@/types/user';

interface UserService {
	getAll(): User[];
	getCurrent(): User | null;
}

const mockCurrentUser: User = {
	id: '1',
	firstName: 'John',
	lastName: 'Doe',
	image: null,
	email: 'john.doe@gmail.com',
	role: 'admin',
};

export class UserLocalStorageService implements UserService {
	public getAll(): User[] {
		const users: User[] = [
			mockCurrentUser,
			{
				id: '2',
				firstName: 'Jane',
				lastName: 'Doe',
				image: 'https://github.com/shadcn.png',
				email: '',
				role: 'developer',
			},
			{
				id: '3',
				firstName: 'Alice',
				lastName: 'Smith',
				image: 'https://github.com/shadcn.png',
				email: '',
				role: 'devops',
			},
		];

		return users;
	}

	public getCurrent(): User | null {
		return mockCurrentUser;
	}
}
