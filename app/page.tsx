import { ProjectsList } from '@/components/features/project/projects-list';
import { Header } from '@/components/layout/header';

export default function Home() {
	return (
		<div className='min-h-screen'>
			<Header />
			<main className='max-w-5xl w-full p-4 mx-auto'>
				<ProjectsList />
			</main>
		</div>
	);
}
