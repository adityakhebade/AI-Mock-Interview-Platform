import { submissionService } from '../services/submission.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

/**
 * Submission Controller
 * 
 * Handles HTTP requests for submission operations.
 * Delegates business logic to the submission service.
 */

export const submissionController = {
  /**
   * Save or update a submission (auto-save)
   * POST /api/v1/submissions
   */
  save: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const submissionData = req.body;

    const submission = await submissionService.saveSubmission(userId, submissionData);

    sendSuccess(res, { submission }, 'Submission saved successfully', 201);
  }),

  /**
   * Update an existing submission
   * PATCH /api/v1/submissions/:id
   */
  update: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const updateData = req.body;

    const submission = await submissionService.updateSubmission(userId, id, updateData);

    sendSuccess(res, { submission }, 'Submission updated successfully');
  }),

  /**
   * Get all submissions for an interview
   * GET /api/v1/submissions/interview/:interviewId
   */
  listByInterview: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { interviewId } = req.params;

    const result = await submissionService.listSubmissions(userId, interviewId);

    sendSuccess(res, result);
  }),

  /**
   * Get a single submission
   * GET /api/v1/submissions/:id
   */
  get: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    const submission = await submissionService.getSubmission(userId, id);

    sendSuccess(res, { submission });
  }),

  /**
   * Delete a submission
   * DELETE /api/v1/submissions/:id
   */
  remove: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    await submissionService.deleteSubmission(userId, id);

    sendSuccess(res, null, 'Submission deleted successfully');
  }),
};
