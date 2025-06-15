'use client';

import { storiesAtom } from '@/stores/stories-store';
import { StoryStatus } from '@/types/story';
import { StoryCard } from './story-card';
import { useAtomValue } from 'jotai';
import { CircleCheck, CircleDot, Loader } from 'lucide-react';

export const ProjectStoriesList = ({ projectId }: { projectId: string }) => {
	const stories = useAtomValue(storiesAtom);

	const filteredStories = stories.filter((s) => s.projectId === projectId);

	return (
		<ul className='flex flex-1 w-max overflow-x-auto space-x-4'>
			{Object.values(StoryStatus).map((storyVariant) => (
				<li className='shrink-0 p-4 space-y-4 rounded-md min-h-full basis-80 border' key={storyVariant}>
					<div className='flex gap-3 items-center'>
						{storyVariant === StoryStatus.Todo ? (
							<CircleDot className='text-purple-600' size={16} />
						) : storyVariant === StoryStatus.Doing ? (
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
							{filteredStories
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
