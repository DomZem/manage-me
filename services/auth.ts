import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User } from '@/types/user';
import { userSchema } from '@/common/validation/user';
import { z } from 'zod';
import { signUpSchema } from '@/common/validation/auth';
import argon2 from 'argon2';

type SignInResponse =
	| {
			status: 'success';
			user: Omit<User, 'password'>;
	  }
	| {
			status: 'error';
			message: string;
			code: 'USER_NOT_FOUND' | 'INVALID_CREDENTIALS' | 'PARSE_ERROR';
	  };

type SignUpResponse =
	| {
			status: 'success';
			user: Omit<User, 'password'>;
	  }
	| {
			status: 'error';
			message: string;
			code: 'USER_EXISTS' | 'INVALID_DATA' | 'PARSE_ERROR';
	  };

export interface IAuthService {
	signIn(login: string, password: string): Promise<SignInResponse>;
	signUp(data: z.infer<typeof signUpSchema>): Promise<SignUpResponse>;
}

export class AuthFirebaseService implements IAuthService {
	private readonly collectionName = 'users';

	public async signIn(login: string, password: string): Promise<SignInResponse> {
		const usersRef = collection(db, this.collectionName);
		const q = query(usersRef, where('login', '==', login));
		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			return {
				status: 'error',
				message: `User with login ${login} not found`,
				code: 'USER_NOT_FOUND',
			} as const;
		}

		const docSnap = querySnapshot.docs[0]; // assuming logins are unique
		const user = { id: docSnap.id, ...docSnap.data() };

		const parseResult = userSchema
			.extend({
				password: z.string().min(1, 'Password is required'),
			})
			.safeParse(user);

		if (!parseResult.success) {
			console.warn(`User with login ${login} is invalid:`, parseResult.error.format());
			return {
				status: 'error',
				message: `User with login ${login} is invalid`,
				code: 'PARSE_ERROR',
			} as const;
		}

		const isPasswordValid = await argon2.verify(parseResult.data.password, password);

		if (!isPasswordValid) {
			return {
				status: 'error',
				message: `Invalid credentials for user with login ${login}`,
				code: 'INVALID_CREDENTIALS',
			} as const;
		}

		return {
			status: 'success',
			user: parseResult.data,
		} as const;
	}

	public async signUp(data: z.infer<typeof signUpSchema>): Promise<SignUpResponse> {
		const usersRef = collection(db, this.collectionName);
		const q = query(usersRef, where('login', '==', data.login));
		const querySnapshot = await getDocs(q);

		if (!querySnapshot.empty) {
			return {
				status: 'error',
				message: `User with login ${data.login} already exists`,
				code: 'USER_EXISTS',
			} as const;
		}

		const parseResult = signUpSchema.safeParse(data);

		if (!parseResult.success) {
			console.warn(`Invalid user data for sign up:`, parseResult.error.format());

			return {
				status: 'error',
				message: `Invalid user data`,
				code: 'INVALID_DATA',
			} as const;
		}

		const hashedPassword = await argon2.hash(parseResult.data.password);

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password: _p, repeatPassword: _rp, ...userData } = parseResult.data;

		const docRef = await addDoc(collection(db, this.collectionName), {
			...userData,
			password: hashedPassword,
		});

		return {
			status: 'success',
			user: {
				id: docRef.id,
				...userData,
			},
		} as const;
	}
}
