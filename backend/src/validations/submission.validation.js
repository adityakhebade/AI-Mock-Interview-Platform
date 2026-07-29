import { z } from 'zod';

/**
 * Submission Validation Schemas
 * 
 * Defines Zod schemas for validating submission-related requests.
 */

/**
 * Schema for saving a submission (create or update via auto-save)
 */
export const saveSubmissionSchema = z.object({
  interviewId: z.string().cuid('Invalid interview ID format'),
  questionId: z.string().cuid('Invalid question ID format'),
  answer: z.string().max(10000, 'Answer cannot exceed 10,000 characters').optional(),
  code: z.string().max(50000, 'Code cannot exceed 50,000 characters').optional(),
  language: z.string().max(50, 'Language name cannot exceed 50 characters').optional(),
}).refine(
  (data) => data.answer || data.code,
  {
    message: 'At least one of answer or code must be provided',
  }
);

/**
 * Schema for updating a submission
 */
export const updateSubmissionSchema = z.object({
  answer: z.string().max(10000, 'Answer cannot exceed 10,000 characters').optional(),
  code: z.string().max(50000, 'Code cannot exceed 50,000 characters').optional(),
  language: z.string().max(50, 'Language name cannot exceed 50 characters').optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
).refine(
  (data) => data.answer || data.code || !data.language,
  { message: 'Language can only be provided with code' }
);

/**
 * Schema for submission ID parameter
 */
export const submissionIdSchema = z.object({
  id: z.string().cuid('Invalid submission ID format'),
});

/**
 * Schema for interview ID parameter
 */
export const interviewIdParamSchema = z.object({
  interviewId: z.string().cuid('Invalid interview ID format'),
});
