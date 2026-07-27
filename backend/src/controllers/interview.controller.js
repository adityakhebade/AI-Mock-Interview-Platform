import { asyncHandler } from '../utils/asyncHandler.js';
import { interviewService } from '../services/interview.service.js';
import { sendSuccess } from '../utils/response.js';

/**
 * Interview Controller
 * 
 * Handles HTTP requests for interview endpoints.
 * Only responsible for request/response handling.
 */

/**
 * POST /api/v1/interviews
 * Create a new interview
 */
export const createInterview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const interviewData = req.body;

  const interview = await interviewService.createInterview(
    userId,
    interviewData
  );

  sendSuccess(res, interview, 'Interview created successfully', 201);
});

/**
 * GET /api/v1/interviews
 * List all interviews for authenticated user
 */
export const listInterviews = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { status } = req.query;

  const filters = {};
  if (status) {
    filters.status = status;
  }

  const interviews = await interviewService.listInterviews(userId, filters);

  sendSuccess(res, { interviews }, 'Interviews retrieved successfully');
});

/**
 * GET /api/v1/interviews/:id
 * Get a specific interview
 */
export const getInterview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const interview = await interviewService.getInterview(id, userId);

  sendSuccess(res, interview, 'Interview retrieved successfully');
});

/**
 * PATCH /api/v1/interviews/:id
 * Update an interview (only DRAFT status allowed)
 */
export const updateInterview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const updateData = req.body;

  const interview = await interviewService.updateInterview(
    id,
    userId,
    updateData
  );

  sendSuccess(res, interview, 'Interview updated successfully');
});

/**
 * DELETE /api/v1/interviews/:id
 * Delete an interview
 */
export const deleteInterview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const result = await interviewService.deleteInterview(id, userId);

  sendSuccess(res, result, 'Interview deleted successfully');
});

/**
 * POST /api/v1/interviews/:id/start
 * Start an interview (DRAFT → IN_PROGRESS)
 */
export const startInterview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const interview = await interviewService.startInterview(id, userId);

  sendSuccess(res, interview, 'Interview started successfully');
});

/**
 * POST /api/v1/interviews/:id/complete
 * Complete an interview (IN_PROGRESS → COMPLETED)
 */
export const completeInterview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const interview = await interviewService.completeInterview(id, userId);

  sendSuccess(res, interview, 'Interview completed successfully');
});
