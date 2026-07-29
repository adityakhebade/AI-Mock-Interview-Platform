import { dashboardService } from '../services/dashboard.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

/**
 * Dashboard Controller
 * 
 * Handles HTTP requests for dashboard operations.
 * Delegates business logic to the dashboard service.
 */

export const dashboardController = {
  /**
   * Get complete dashboard overview
   * GET /api/v1/dashboard
   */
  overview: asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const dashboard = await dashboardService.getDashboard(userId);

    sendSuccess(res, dashboard);
  }),

  /**
   * Get dashboard statistics
   * GET /api/v1/dashboard/stats
   */
  stats: asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const result = await dashboardService.getStats(userId);

    sendSuccess(res, result);
  }),

  /**
   * Get dashboard analytics
   * GET /api/v1/dashboard/analytics
   */
  analytics: asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const result = await dashboardService.getAnalytics(userId);

    sendSuccess(res, result);
  }),

  /**
   * Get recent activity
   * GET /api/v1/dashboard/recent
   */
  recent: asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const result = await dashboardService.getRecentActivity(userId);

    sendSuccess(res, result);
  }),
};
