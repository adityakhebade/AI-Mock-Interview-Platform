import { z } from 'zod';

/**
 * AI Validation Schemas
 * 
 * Defines Zod schemas for validating AI-related requests.
 */

/**
 * Schema for question generation request
 */
export const generateQuestionsSchema = z.object({
  role: z.string().min(2, 'Role must be at least 2 characters').max(100),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD'], {
    errorMap: () => ({ message: 'Difficulty must be EASY, MEDIUM, or HARD' }),
  }),
  count: z.number().int().min(1).max(50).optional().default(10),
  resumeText: z.string().optional(),
});

/**
 * Schema for interview evaluation request
 */
export const evaluateInterviewSchema = z.object({
  role: z.string().min(2, 'Role must be at least 2 characters').max(100),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD'], {
    errorMap: () => ({ message: 'Difficulty must be EASY, MEDIUM, or HARD' }),
  }),
  questionsAndAnswers: z
    .array(
      z.object({
        question: z.string().min(10, 'Question must be at least 10 characters'),
        answer: z.string().optional(),
        code: z.string().optional(),
        language: z.string().optional(),
      })
    )
    .min(1, 'At least one question and answer is required')
    .max(50, 'Cannot evaluate more than 50 questions at once'),
});

/**
 * Schema for resume analysis request
 */
export const analyzeResumeSchema = z.object({
  resumeText: z.string().min(100, 'Resume text must be at least 100 characters'),
  targetRole: z.string().min(2).max(100).optional(),
});
