import express from 'express';
import {
  createInterview,
  listInterviews,
  getInterview,
  updateInterview,
  deleteInterview,
  startInterview,
  completeInterview,
} from '../controllers/interview.controller.js';
import { requireAuthentication } from '../middleware/auth.middleware.js';
import { validate, validateQuery } from '../middleware/validate.middleware.js';
import {
  createInterviewSchema,
  updateInterviewSchema,
  interviewQuerySchema,
} from '../validations/interview.validation.js';

const router = express.Router();

/**
 * Interview Routes
 * Base path: /api/v1/interviews
 * 
 * All routes require authentication
 */

// Apply authentication to all interview routes
router.use(requireAuthentication);

/**
 * POST /api/v1/interviews
 * Create a new interview
 */
router.post('/', validate(createInterviewSchema), createInterview);

/**
 * GET /api/v1/interviews
 * List all interviews for authenticated user
 * Query params: status (optional)
 */
router.get('/', validateQuery(interviewQuerySchema), listInterviews);

/**
 * GET /api/v1/interviews/:id
 * Get a specific interview by ID
 */
router.get('/:id', getInterview);

/**
 * PATCH /api/v1/interviews/:id
 * Update an interview (only DRAFT status)
 */
router.patch('/:id', validate(updateInterviewSchema), updateInterview);

/**
 * DELETE /api/v1/interviews/:id
 * Delete an interview
 */
router.delete('/:id', deleteInterview);

/**
 * POST /api/v1/interviews/:id/start
 * Start an interview (DRAFT → IN_PROGRESS)
 */
router.post('/:id/start', startInterview);

/**
 * POST /api/v1/interviews/:id/complete
 * Complete an interview (IN_PROGRESS → COMPLETED)
 */
router.post('/:id/complete', completeInterview);

export default router;
