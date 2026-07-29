import { z } from 'zod';

/**
 * Report Validation Schemas
 * 
 * Defines Zod schemas for validating report-related requests.
 */

/**
 * Schema for interview ID parameter
 */
export const interviewIdParamSchema = z.object({
  interviewId: z.string().cuid('Invalid interview ID format'),
});

/**
 * Schema for report ID parameter
 */
export const reportIdParamSchema = z.object({
  id: z.string().cuid('Invalid report ID format'),
});
