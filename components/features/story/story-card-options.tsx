import { selectedStoryStore } from '@/stores/story/selected-story-store';
import { useSetAtom } from 'jotai';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Ellipsis, SquarePen, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Story } from '@/types/story';

export const StoryCardOptions = ({ story }: { story: Story }) => {
	const setSelectedStory = useSetAtom(selectedStoryStore);

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
							setSelectedStory({ action: 'update', story });
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
							setSelectedStory({ action: 'delete', story });
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
