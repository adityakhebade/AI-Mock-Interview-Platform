import express from 'express';
import { evaluationController } from '../controllers/evaluation.controller.js';
import { requireAuthentication } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createEvaluationSchema,
  updateEvaluationSchema,
  interviewIdParamSchema,
} from '../validations/evaluation.validation.js';

const router = express.Router();

/**
 * Evaluation Routes
 * 
 * All routes require authentication.
 * Base path: /api/v1/evaluations
 */

// Apply authentication middleware to all routes
router.use(requireAuthentication);

/**
 * GET /api/v1/evaluations
 * Get all evaluations for the authenticated user
 */
router.get('/', evaluationController.list);

/**
 * POST /api/v1/evaluations/:interviewId
 * Create an evaluation for a completed interview
 */
router.post(
  '/:interviewId',
  validate(interviewIdParamSchema, 'params'),
  validate(createEvaluationSchema),
  evaluationController.create
);

/**
 * GET /api/v1/evaluations/:interviewId
 * Get evaluation for a specific interview
 */
router.get(
  '/:interviewId',
  validate(interviewIdParamSchema, 'params'),
  evaluationController.get
);

/**
 * PATCH /api/v1/evaluations/:interviewId
 * Update an existing evaluation
 */
router.patch(
  '/:interviewId',
  validate(interviewIdParamSchema, 'params'),
  validate(updateEvaluationSchema),
  evaluationController.update
);

/**
 * DELETE /api/v1/evaluations/:interviewId
 * Delete an evaluation
 */
router.delete(
  '/:interviewId',
  validate(interviewIdParamSchema, 'params'),
  evaluationController.remove
);

export default router;
