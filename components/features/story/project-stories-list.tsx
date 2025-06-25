'use client';

import { StoryCard } from './story-card';
import { CircleCheck, CircleDot, Loader } from 'lucide-react';
import { STORY_STATUSES } from '@/common/validation/story';
import { useProjectStories } from '@/hooks/story/useProjectStories';

export const ProjectStoriesList = ({ projectId }: { projectId: string }) => {
	const { data: stories } = useProjectStories({
		projectId,
	});

	if (!stories) {
		return null;
	}

	return (
		<ul className='flex flex-1 w-max overflow-x-auto space-x-4'>
			{STORY_STATUSES.map((storyVariant) => (
				<li className='shrink-0 p-4 space-y-4 rounded-md min-h-full basis-80 border' key={storyVariant}>
					<div className='flex gap-3 items-center'>
						{storyVariant === 'todo' ? (
							<CircleDot className='text-purple-600' size={16} />
						) : storyVariant === 'doing' ? (
							<Loader className='text-orange-600' size={16} />
						) : (
							<CircleCheck className='text-green-600' size={16} />
						)}

						<h3 className='font-semibold'>
							{storyVariant.charAt(0).toUpperCase()}
							{storyVariant.slice(1)}
						</h3>
					</div>

					<div>
						<ul className='space-y-2'>
							{stories
								.filter((story) => story.status === storyVariant)
								.map((story) => (
									<li key={story.id}>
										<StoryCard story={story} />
									</li>
								))}
						</ul>
					</div>
				</li>
			))}
		</ul>
	);
};
