import { dashboardRepository } from '../repositories/dashboard.repository.js';

/**
 * Dashboard Service
 * 
 * Contains business logic for dashboard data aggregation.
 * Formats and validates dashboard data.
 */

export const dashboardService = {
  /**
   * Get complete dashboard overview
   * 
   * @param {string} userId - Authenticated user ID
   * @returns {Promise<Object>} Complete dashboard data
   */
  async getDashboard(userId) {
    const dashboard = await dashboardRepository.getCompleteDashboard(userId);

    return {
      stats: dashboard.stats,
      analytics: dashboard.analytics,
      recentActivity: dashboard.recentActivity,
    };
  },

  /**
   * Get dashboard statistics only
   * 
   * @param {string} userId - Authenticated user ID
   * @returns {Promise<Object>} Dashboard statistics
   */
  async getStats(userId) {
    const stats = await dashboardRepository.getDashboardStats(userId);

    return {
      stats,
    };
  },

  /**
   * Get dashboard analytics only
   * 
   * @param {string} userId - Authenticated user ID
   * @returns {Promise<Object>} Dashboard analytics
   */
  async getAnalytics(userId) {
    const analytics = await dashboardRepository.getDashboardAnalytics(userId);

    return {
      analytics,
    };
  },

  /**
   * Get recent activity only
   * 
   * @param {string} userId - Authenticated user ID
   * @returns {Promise<Object>} Recent activity
   */
  async getRecentActivity(userId) {
    const [recentInterviews, recentReports, latestResume] = await Promise.all([
      dashboardRepository.getRecentInterviews(userId, 5),
      dashboardRepository.getRecentReports(userId, 5),
      dashboardRepository.getLatestResume(userId),
    ]);

    return {
      recentActivity: {
        interviews: recentInterviews,
        reports: recentReports,
        latestResume,
      },
    };
  },
};
