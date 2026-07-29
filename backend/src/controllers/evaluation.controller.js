import { evaluationService } from '../services/evaluation.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

/**
 * Evaluation Controller
 * 
 * Handles HTTP requests for evaluation operations.
 * Delegates business logic to the evaluation service.
 */

export const evaluationController = {
  /**
   * Create an evaluation for a completed interview
   * POST /api/v1/evaluations/:interviewId
   */
  create: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { interviewId } = req.params;
    const evaluationData = req.body;

    const evaluation = await evaluationService.requestEvaluation(
      userId,
      interviewId,
      evaluationData
    );

    sendSuccess(res, { evaluation }, 'Evaluation created successfully', 201);
  }),

  /**
   * Get evaluation for an interview
   * GET /api/v1/evaluations/:interviewId
   */
  get: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { interviewId } = req.params;

    const evaluation = await evaluationService.getEvaluation(userId, interviewId);

    sendSuccess(res, { evaluation });
  }),

  /**
   * Get all evaluations for the authenticated user
   * GET /api/v1/evaluations
   */
  list: asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const result = await evaluationService.listEvaluations(userId);

    sendSuccess(res, result);
  }),

  /**
   * Update an existing evaluation
   * PATCH /api/v1/evaluations/:interviewId
   */
  update: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { interviewId } = req.params;
    const updateData = req.body;

    const evaluation = await evaluationService.updateEvaluation(
      userId,
      interviewId,
      updateData
    );

    sendSuccess(res, { evaluation }, 'Evaluation updated successfully');
  }),

  /**
   * Delete an evaluation
   * DELETE /api/v1/evaluations/:interviewId
   */
  remove: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { interviewId } = req.params;

    await evaluationService.deleteEvaluation(userId, interviewId);

    sendSuccess(res, null, 'Evaluation deleted successfully');
  }),
};
