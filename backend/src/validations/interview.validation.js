import { z } from 'zod';

/**
 * Interview Validation Schemas
 * 
 * Zod schemas for validating interview requests.
 */

/**
 * Create Interview Schema
 */
export const createInterviewSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must not exceed 200 characters')
    .trim(),

  role: z
    .string()
    .min(1, 'Role is required')
    .max(100, 'Role must not exceed 100 characters')
    .trim(),

  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD'], {
    errorMap: () => ({ message: 'Difficulty must be EASY, MEDIUM, or HARD' }),
  }),

  language: z
    .string()
    .min(1, 'Language is required')
    .max(50, 'Language must not exceed 50 characters')
    .trim(),

  duration: z
    .number()
    .int('Duration must be an integer')
    .min(15, 'Duration must be at least 15 minutes')
    .max(180, 'Duration must not exceed 180 minutes'),

  resumeId: z.string().cuid('Invalid resume ID format').optional(),
}).strict();

/**
 * Update Interview Schema
 * All fields optional for partial updates
 */
export const updateInterviewSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must not exceed 200 characters')
    .trim()
    .optional(),

  role: z
    .string()
    .min(1, 'Role cannot be empty')
    .max(100, 'Role must not exceed 100 characters')
    .trim()
    .optional(),

  difficulty: z
    .enum(['EASY', 'MEDIUM', 'HARD'], {
      errorMap: () => ({ message: 'Difficulty must be EASY, MEDIUM, or HARD' }),
    })
    .optional(),

  language: z
    .string()
    .min(1, 'Language cannot be empty')
    .max(50, 'Language must not exceed 50 characters')
    .trim()
    .optional(),

  duration: z
    .number()
    .int('Duration must be an integer')
    .min(15, 'Duration must be at least 15 minutes')
    .max(180, 'Duration must not exceed 180 minutes')
    .optional(),

  resumeId: z.string().cuid('Invalid resume ID format').optional().nullable(),
}).strict();

/**
 * Interview ID Parameter Schema
 */
export const interviewIdParamSchema = z.object({
  id: z.string().cuid('Invalid interview ID format'),
});

/**
 * Query Filters Schema
 */
export const interviewQuerySchema = z.object({
  status: z
    .enum(['DRAFT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], {
      errorMap: () => ({
        message: 'Status must be DRAFT, IN_PROGRESS, COMPLETED, or CANCELLED',
      }),
    })
    .optional(),
});
