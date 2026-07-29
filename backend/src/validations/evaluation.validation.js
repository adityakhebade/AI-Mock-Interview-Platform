import { z } from 'zod';

/**
 * Evaluation Validation Schemas
 * 
 * Defines Zod schemas for validating evaluation-related requests.
 */

/**
 * Schema for creating an evaluation
 */
export const createEvaluationSchema = z.object({
  score: z
    .number()
    .int('Score must be an integer')
    .min(0, 'Score must be at least 0')
    .max(100, 'Score cannot exceed 100'),
  strengths: z
    .string()
    .min(1, 'Strengths cannot be empty')
    .max(5000, 'Strengths cannot exceed 5,000 characters'),
  weaknesses: z
    .string()
    .min(1, 'Weaknesses cannot be empty')
    .max(5000, 'Weaknesses cannot exceed 5,000 characters'),
  feedback: z
    .string()
    .min(1, 'Feedback cannot be empty')
    .max(10000, 'Feedback cannot exceed 10,000 characters'),
});

/**
 * Schema for updating an evaluation
 */
export const updateEvaluationSchema = z
  .object({
    score: z
      .number()
      .int('Score must be an integer')
      .min(0, 'Score must be at least 0')
      .max(100, 'Score cannot exceed 100')
      .optional(),
    strengths: z
      .string()
      .min(1, 'Strengths cannot be empty')
      .max(5000, 'Strengths cannot exceed 5,000 characters')
      .optional(),
    weaknesses: z
      .string()
      .min(1, 'Weaknesses cannot be empty')
      .max(5000, 'Weaknesses cannot exceed 5,000 characters')
      .optional(),
    feedback: z
      .string()
      .min(1, 'Feedback cannot be empty')
      .max(10000, 'Feedback cannot exceed 10,000 characters')
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

/**
 * Schema for interview ID parameter
 */
export const interviewIdParamSchema = z.object({
  interviewId: z.string().cuid('Invalid interview ID format'),
});
