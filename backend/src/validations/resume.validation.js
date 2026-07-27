import { z } from 'zod';

/**
 * Resume Validation Schemas
 * 
 * Zod schemas for validating resume request parameters.
 * File validation is handled by Multer middleware.
 */

/**
 * Resume ID parameter validation
 */
export const resumeIdParamSchema = z.object({
  id: z.string().cuid('Invalid resume ID format'),
});

/**
 * Helper function to validate resume ID parameter
 */
export const validateResumeIdParam = (params) => {
  return resumeIdParamSchema.parse(params);
};
