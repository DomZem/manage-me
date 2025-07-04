import { userSchema } from '@/common/validation/user';
import { db } from '@/lib/firebase';
import { User } from '@/types/user';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

interface IUserService {
	getAll(): Promise<User[]>;
	getOne(id: string): Promise<User | undefined>;
}

export class UserFirebaseService implements IUserService {
	private readonly collectionName = 'users';

	// DONE
	public async getAll(): Promise<User[]> {
		const querySnapshot = await getDocs(collection(db, this.collectionName));

		const users: User[] = [];

		for (const docSnap of querySnapshot.docs) {
			const data = { id: docSnap.id, ...docSnap.data() };

			const parseResult = userSchema.safeParse(data);

			if (parseResult.success) {
				users.push(parseResult.data);
			} else {
				console.warn(`Skipping invalid user [${docSnap.id}]`, parseResult.error.format());
			}
		}

		return users;
	}

	// DONE
	public async getOne(id: string): Promise<User | undefined> {
		const docRef = doc(db, this.collectionName, id);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) return undefined;

		const user = { id: docSnap.id, ...docSnap.data() };
		const parseResult = userSchema.safeParse(user);

		if (!parseResult.success) {
			console.warn(`User with id ${id} is invalid: ${parseResult.error.format()}`);
			return undefined;
		}

		return parseResult.data;
	}
}
