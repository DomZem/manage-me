import { selectedStoryStore } from '@/stores/selected-story-store';
import { Card } from '@/components/ui/card';
import type { Story } from '@/types/story';
import { useSetAtom } from 'jotai';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Ellipsis, SquarePen, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const StoryCard = ({ story }: { story: Story }) => {
	const setSelectedStory = useSetAtom(selectedStoryStore);

	return (
		<Card className='p-2 rounded-md hover:border-purple-600 duration-200 transition-colors cursor-pointer flex items-start justify-between gap-3 bg-sidebar'>
			<div className='space-y-1'>
				<p className='text-xs'>#{story.id.substring(0, 5)}</p>
				<p className='text-sm font-medium'>{story.name}</p>
			</div>

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
		</Card>
	);
};
