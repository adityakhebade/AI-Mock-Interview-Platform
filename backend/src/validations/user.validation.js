import { z } from 'zod';

/**
 * User Validation Schemas
 * 
 * Zod schemas for validating user profile requests.
 */

/**
 * Update Profile Schema
 * 
 * Validates PATCH /api/v1/users/me request body
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .trim()
    .optional(),
  
  imageUrl: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .nullable(),
}).strict(); // Don't allow extra fields

/**
 * Helper function to validate update profile data
 */
export const validateUpdateProfile = (data) => {
  return updateProfileSchema.parse(data);
};
