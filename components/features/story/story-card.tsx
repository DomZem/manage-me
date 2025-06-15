import { selectedStoryStore } from '@/stores/selected-story-store';
import { Card } from '@/components/ui/card';
import type { Story } from '@/types/story';
import { useSetAtom } from 'jotai';
import { StoryCardOptions } from './story-card-options';

export const StoryCard = ({ story }: { story: Story }) => {
	const setSelectedStory = useSetAtom(selectedStoryStore);

	return (
		<Card
			className='p-2 rounded-md hover:border-purple-600 duration-200 transition-colors cursor-pointer flex items-start justify-between gap-3 bg-sidebar'
			onClick={() => {
				setSelectedStory({ action: 'details', story });
			}}
		>
			<div className='space-y-1'>
				<p className='text-xs'>#{story.id.substring(0, 5)}</p>
				<p className='text-sm font-medium'>{story.name}</p>
			</div>

			<StoryCardOptions story={story} />
		</Card>
	);
};
