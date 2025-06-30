import { collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export class TestDatabaseUtils {
	/**
	 * Clears all documents from the projects collection
	 */
	static async clearProjectsCollection(): Promise<void> {
		try {
			const projectsCollection = collection(db, 'projects');
			const snapshot = await getDocs(projectsCollection);

			const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));

			await Promise.all(deletePromises);
			console.log(`Cleared ${snapshot.docs.length} projects from test database`);
		} catch (error) {
			console.warn('Failed to clear projects collection:', error);
			// Don't throw - tests should continue even if cleanup fails
		}
	}

	/**
	 * Clears all documents from multiple collections
	 */
	static async clearAllTestData(): Promise<void> {
		await Promise.all([
			this.clearProjectsCollection(),
			// Add other collections here as needed:
			// this.clearStoriesCollection(),
			// this.clearTasksCollection(),
		]);
	}

	/**
	 * Seeds the projects collection with test data
	 */
	static async seedProjects(projects: Array<{ name: string; description: string }>): Promise<void> {
		const { ProjectFirebaseService } = await import('@/services/project/project-firebase');
		const service = new ProjectFirebaseService();

		const createPromises = projects.map((project) => service.create(project));

		await Promise.all(createPromises);
	}

	/**
	 * Gets the current count of documents in the projects collection
	 */
	static async getProjectsCount(): Promise<number> {
		const projectsCollection = collection(db, 'projects');
		const snapshot = await getDocs(projectsCollection);
		return snapshot.size;
	}
}
