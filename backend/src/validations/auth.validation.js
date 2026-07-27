import { z } from 'zod';

/**
 * Authentication Validation Schemas
 * 
 * Zod schemas for validating authentication requests.
 */

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  imageUrl: z.string().url('Must be a valid URL').optional(),
});

export const validateUpdateProfile = (data) => {
  return updateProfileSchema.parse(data);
};
