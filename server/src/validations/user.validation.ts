import { z } from 'zod';

export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Display name must not be empty')
    .max(100, 'Display name must not exceed 100 characters')
    .optional(),
  imageUrl: z
    .string()
    .url('Image URL must be a valid URL')
    .max(500, 'Image URL must not exceed 500 characters')
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
