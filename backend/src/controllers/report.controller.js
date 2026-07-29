import { reportService } from '../services/report.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

/**
 * Report Controller
 * 
 * Handles HTTP requests for report operations.
 * Delegates business logic to the report service.
 */

export const reportController = {
  /**
   * Generate a report from an existing evaluation
   * POST /api/v1/reports/:interviewId
   */
  generate: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { interviewId } = req.params;

    const report = await reportService.generateReport(userId, interviewId);

    sendSuccess(res, { report }, 'Report generated successfully', 201);
  }),

  /**
   * Get a specific report
   * GET /api/v1/reports/:id
   */
  get: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    const report = await reportService.getReport(userId, id);

    sendSuccess(res, { report });
  }),

  /**
   * Get all reports for the authenticated user
   * GET /api/v1/reports
   */
  list: asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const result = await reportService.listReports(userId);

    sendSuccess(res, result);
  }),

  /**
   * Delete a report
   * DELETE /api/v1/reports/:id
   */
  remove: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    await reportService.deleteReport(userId, id);

    sendSuccess(res, null, 'Report deleted successfully');
  }),
};
