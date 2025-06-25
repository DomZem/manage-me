import type { storySchema } from '@/common/validation/story';
import type { z } from 'zod';

export type Story = Required<z.infer<typeof storySchema>>;
