import express from 'express';
import { reportController } from '../controllers/report.controller.js';
import { requireAuthentication } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  interviewIdParamSchema,
  reportIdParamSchema,
} from '../validations/report.validation.js';

const router = express.Router();

/**
 * Report Routes
 * 
 * All routes require authentication.
 * Base path: /api/v1/reports
 */

// Apply authentication middleware to all routes
router.use(requireAuthentication);

/**
 * GET /api/v1/reports
 * Get all reports for the authenticated user
 */
router.get('/', reportController.list);

/**
 * POST /api/v1/reports/:interviewId
 * Generate a report from an existing evaluation
 */
router.post(
  '/:interviewId',
  validate(interviewIdParamSchema, 'params'),
  reportController.generate
);

/**
 * GET /api/v1/reports/:id
 * Get a specific report
 */
router.get(
  '/:id',
  validate(reportIdParamSchema, 'params'),
  reportController.get
);

/**
 * DELETE /api/v1/reports/:id
 * Delete a report
 */
router.delete(
  '/:id',
  validate(reportIdParamSchema, 'params'),
  reportController.remove
);

export default router;
