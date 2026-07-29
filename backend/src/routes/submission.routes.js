import express from 'express';
import { submissionController } from '../controllers/submission.controller.js';
import { requireAuthentication } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  saveSubmissionSchema,
  updateSubmissionSchema,
  submissionIdSchema,
  interviewIdParamSchema,
} from '../validations/submission.validation.js';

const router = express.Router();

/**
 * Submission Routes
 * 
 * All routes require authentication.
 * Base path: /api/v1/submissions
 */

// Apply authentication middleware to all routes
router.use(requireAuthentication);

/**
 * POST /api/v1/submissions
 * Save or update a submission (auto-save functionality)
 */
router.post(
  '/',
  validate(saveSubmissionSchema),
  submissionController.save
);

/**
 * GET /api/v1/submissions/interview/:interviewId
 * Get all submissions for an interview
 */
router.get(
  '/interview/:interviewId',
  validate(interviewIdParamSchema, 'params'),
  submissionController.listByInterview
);

/**
 * GET /api/v1/submissions/:id
 * Get a single submission
 */
router.get(
  '/:id',
  validate(submissionIdSchema, 'params'),
  submissionController.get
);

/**
 * PATCH /api/v1/submissions/:id
 * Update a submission
 */
router.patch(
  '/:id',
  validate(submissionIdSchema, 'params'),
  validate(updateSubmissionSchema),
  submissionController.update
);

/**
 * DELETE /api/v1/submissions/:id
 * Delete a submission
 */
router.delete(
  '/:id',
  validate(submissionIdSchema, 'params'),
  submissionController.remove
);

export default router;
