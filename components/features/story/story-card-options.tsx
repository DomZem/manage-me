import { currentStoryActionStore, selectedStoryStore } from '@/stores/story/story-store';
import { useSetAtom } from 'jotai';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Ellipsis, SquarePen, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Story } from '@/types/story';

export const StoryCardOptions = ({ story }: { story: Story }) => {
	const setSelectedStory = useSetAtom(selectedStoryStore);
	const setCurrentAction = useSetAtom(currentStoryActionStore);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					onClick={(e) => {
						e.stopPropagation();
					}}
					variant='ghost'
					className='p-1 size-5'
				>
					<Ellipsis />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem asChild>
					<Button
						className='w-full justify-start cursor-pointer'
						variant='ghost'
						onClick={(e) => {
							e.stopPropagation();
							setSelectedStory(story);
							setCurrentAction('update');
						}}
					>
						<SquarePen />
						Update
					</Button>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Button
						className='w-full justify-start cursor-pointer'
						variant='ghost'
						onClick={(e) => {
							e.stopPropagation();
							setSelectedStory(story);
							setCurrentAction('delete');
						}}
					>
						<Trash2 />
						Delete
					</Button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
