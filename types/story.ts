import type { storySchema } from '@/common/validation/story';
import type { z } from 'zod';

export type Story = z.infer<typeof storySchema>;
