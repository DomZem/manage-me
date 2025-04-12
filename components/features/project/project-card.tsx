import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { selectedProjectStore } from '@/stores/selected-project-store';
import { Ellipsis, PanelsTopLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Project } from '@/types/project';
import { useSetAtom } from 'jotai';

export const ProjectCard = ({ project }: { project: Project }) => {
	const setSelectedProject = useSetAtom(selectedProjectStore);

	return (
		<Card className='p-4'>
			<div className='flex justify-between items-center'>
				<div>
					<div className='inline-flex items-center gap-3'>
						<PanelsTopLeft />
						<CardTitle>{project.name}</CardTitle>
					</div>
					<CardDescription>#{project.id}</CardDescription>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							onClick={(e) => {
								e.stopPropagation();
							}}
							variant='ghost'
							size='icon'
						>
							<Ellipsis />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem asChild>
							<Button
								className='w-full cursor-pointer'
								size='sm'
								variant='ghost'
								onClick={(e) => {
									e.stopPropagation();
									setSelectedProject({ action: 'update', project });
								}}
							>
								Update
							</Button>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Button
								className='w-full cursor-pointer'
								size='sm'
								variant='ghost'
								onClick={(e) => {
									e.stopPropagation();
									setSelectedProject({ action: 'delete', project });
								}}
							>
								Delete
							</Button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</Card>
	);
};
