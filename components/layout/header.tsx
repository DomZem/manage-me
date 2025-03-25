import { CreateProjectModal } from '../features/project/create-project-modal';
import { ModeToggle } from '../ui/mode-toggle';
import { PanelsTopLeft } from 'lucide-react';

export const Header = () => {
	return (
		<header className='p-4 border-b border-border flex items-center justify-between'>
			<div className='inline-flex items-center gap-3'>
				<PanelsTopLeft />
				<h1 className='text-xl font-semibold tracking-tight'>ManageMe</h1>
			</div>

			<div className='inline-flex items-center gap-3'>
				<ModeToggle />
				<CreateProjectModal />
			</div>
		</header>
	);
};
