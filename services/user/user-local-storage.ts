import { User } from '@/types/user';

interface UserService {
	getAll(): User[];
	getCurrent(): User | null;
}

export class UserLocalStorageService implements UserService {
	getAll(): User[] {
		throw new Error('Method not implemented.');
	}
	getCurrent(): User | null {
		throw new Error('Method not implemented.');
	}
}
