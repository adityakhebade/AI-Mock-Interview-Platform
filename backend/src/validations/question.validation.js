import { z } from 'zod';

/**
 * Question Validation Schemas
 * 
 * Defines Zod schemas for validating question-related requests.
 */

// Valid question types (matching Prisma enum)
const questionTypes = ['MCQ', 'TECHNICAL', 'CODING', 'HR', 'BEHAVIORAL'];

// Valid difficulty levels (matching Prisma enum)
const difficultyLevels = ['EASY', 'MEDIUM', 'HARD'];

/**
 * Schema for creating a single question
 */
export const createQuestionSchema = z.object({
  interviewId: z.string().cuid('Invalid interview ID format'),
  question: z.string().min(10, 'Question must be at least 10 characters').max(5000, 'Question cannot exceed 5000 characters'),
  type: z.enum(questionTypes, {
    errorMap: () => ({ message: `Question type must be one of: ${questionTypes.join(', ')}` }),
  }),
  difficulty: z.enum(difficultyLevels, {
    errorMap: () => ({ message: `Difficulty must be one of: ${difficultyLevels.join(', ')}` }),
  }),
  order: z.number().int().positive('Order must be a positive integer').optional(),
});

/**
 * Schema for creating multiple questions (bulk insert)
 */
export const createBulkQuestionsSchema = z.object({
  interviewId: z.string().cuid('Invalid interview ID format'),
  questions: z.array(
    z.object({
      question: z.string().min(10, 'Question must be at least 10 characters').max(5000, 'Question cannot exceed 5000 characters'),
      type: z.enum(questionTypes, {
        errorMap: () => ({ message: `Question type must be one of: ${questionTypes.join(', ')}` }),
      }),
      difficulty: z.enum(difficultyLevels, {
        errorMap: () => ({ message: `Difficulty must be one of: ${difficultyLevels.join(', ')}` }),
      }),
      order: z.number().int().positive('Order must be a positive integer').optional(),
    })
  ).min(1, 'At least one question is required').max(50, 'Cannot create more than 50 questions at once'),
});

/**
 * Schema for updating a question
 */
export const updateQuestionSchema = z.object({
  question: z.string().min(10, 'Question must be at least 10 characters').max(5000, 'Question cannot exceed 5000 characters').optional(),
  type: z.enum(questionTypes, {
    errorMap: () => ({ message: `Question type must be one of: ${questionTypes.join(', ')}` }),
  }).optional(),
  difficulty: z.enum(difficultyLevels, {
    errorMap: () => ({ message: `Difficulty must be one of: ${difficultyLevels.join(', ')}` }),
  }).optional(),
  order: z.number().int().positive('Order must be a positive integer').optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
);

/**
 * Schema for question ID parameter
 */
export const questionIdSchema = z.object({
  id: z.string().cuid('Invalid question ID format'),
});

/**
 * Schema for interview ID parameter
 */
export const interviewIdSchema = z.object({
  interviewId: z.string().cuid('Invalid interview ID format'),
});
