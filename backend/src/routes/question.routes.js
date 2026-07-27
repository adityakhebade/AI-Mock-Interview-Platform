import express from 'express';
import { questionController } from '../controllers/question.controller.js';
import { requireAuthentication } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createQuestionSchema,
  createBulkQuestionsSchema,
  updateQuestionSchema,
  questionIdSchema,
  interviewIdSchema,
} from '../validations/question.validation.js';

const router = express.Router();

/**
 * Question Routes
 * 
 * All routes require authentication.
 * Base path: /api/v1/questions
 */

// Apply authentication middleware to all routes
router.use(requireAuthentication);

/**
 * POST /api/v1/questions
 * Create a new question
 */
router.post(
  '/',
  validate(createQuestionSchema),
  questionController.create
);

/**
 * POST /api/v1/questions/bulk
 * Create multiple questions (bulk insert for AI-generated questions)
 */
router.post(
  '/bulk',
  validate(createBulkQuestionsSchema),
  questionController.createBulk
);

/**
 * GET /api/v1/questions/interview/:interviewId
 * Get all questions for an interview
 */
router.get(
  '/interview/:interviewId',
  validate(interviewIdSchema, 'params'),
  questionController.listByInterview
);

/**
 * GET /api/v1/questions/:id
 * Get a single question
 */
router.get(
  '/:id',
  validate(questionIdSchema, 'params'),
  questionController.get
);

/**
 * PATCH /api/v1/questions/:id
 * Update a question
 */
router.patch(
  '/:id',
  validate(questionIdSchema, 'params'),
  validate(updateQuestionSchema),
  questionController.update
);

/**
 * DELETE /api/v1/questions/:id
 * Delete a question
 */
router.delete(
  '/:id',
  validate(questionIdSchema, 'params'),
  questionController.remove
);

export default router;
