import prisma from '../config/prisma.js';

/**
 * Dashboard Repository
 * 
 * Handles all database operations for dashboard aggregation.
 * Aggregates data from multiple modules for analytics.
 */

export const dashboardRepository = {
  /**
   * Get dashboard statistics for a user
   * 
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Dashboard statistics
   */
  async getDashboardStats(userId) {
    // Run all queries in parallel for better performance
    const [
      totalInterviews,
      completedInterviews,
      activeInterviews,
      totalReports,
      totalResumes,
      evaluations,
    ] = await Promise.all([
      // Total interviews
      prisma.interview.count({
        where: { userId },
      }),

      // Completed interviews
      prisma.interview.count({
        where: {
          userId,
          status: 'COMPLETED',
        },
      }),

      // Active interviews (IN_PROGRESS)
      prisma.interview.count({
        where: {
          userId,
          status: 'IN_PROGRESS',
        },
      }),

      // Total reports
      prisma.report.count({
        where: { userId },
      }),

      // Total resumes
      prisma.resume.count({
        where: { userId },
      }),

      // All evaluations to calculate average score
      prisma.evaluation.findMany({
        where: {
          interview: {
            userId,
          },
        },
        select: {
          score: true,
        },
      }),
    ]);

    // Calculate average score
    const averageScore = evaluations.length > 0
      ? Math.round(evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length)
      : 0;

    return {
      totalInterviews,
      completedInterviews,
      activeInterviews,
      draftInterviews: totalInterviews - completedInterviews - activeInterviews,
      totalReports,
      totalResumes,
      averageScore,
      totalEvaluations: evaluations.length,
    };
  },

  /**
   * Get dashboard analytics for a user
   * 
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Dashboard analytics
   */
  async getDashboardAnalytics(userId) {
    // Run analytics queries in parallel
    const [
      interviewsByStatus,
      interviewsByDifficulty,
      scoreDistribution,
      interviewsByRole,
    ] = await Promise.all([
      // Interviews grouped by status
      prisma.interview.groupBy({
        by: ['status'],
        where: { userId },
        _count: {
          status: true,
        },
      }),

      // Interviews grouped by difficulty
      prisma.interview.groupBy({
        by: ['difficulty'],
        where: { userId },
        _count: {
          difficulty: true,
        },
      }),

      // Evaluations to analyze score distribution
      prisma.evaluation.findMany({
        where: {
          interview: {
            userId,
          },
        },
        select: {
          score: true,
        },
      }),

      // Top 5 roles interviewed for
      prisma.interview.groupBy({
        by: ['role'],
        where: { userId },
        _count: {
          role: true,
        },
        orderBy: {
          _count: {
            role: 'desc',
          },
        },
        take: 5,
      }),
    ]);

    // Format status distribution
    const statusDistribution = interviewsByStatus.reduce((acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {});

    // Format difficulty distribution
    const difficultyDistribution = interviewsByDifficulty.reduce((acc, item) => {
      acc[item.difficulty] = item._count.difficulty;
      return acc;
    }, {});

    // Calculate score ranges
    const scoreRanges = {
      excellent: scoreDistribution.filter(e => e.score >= 90).length,
      good: scoreDistribution.filter(e => e.score >= 70 && e.score < 90).length,
      average: scoreDistribution.filter(e => e.score >= 50 && e.score < 70).length,
      poor: scoreDistribution.filter(e => e.score < 50).length,
    };

    // Format top roles
    const topRoles = interviewsByRole.map(item => ({
      role: item.role,
      count: item._count.role,
    }));

    return {
      statusDistribution,
      difficultyDistribution,
      scoreRanges,
      topRoles,
    };
  },

  /**
   * Get recent interviews for a user
   * 
   * @param {string} userId - User ID
   * @param {number} limit - Number of interviews to fetch (default: 5)
   * @returns {Promise<Array>} Recent interviews
   */
  async getRecentInterviews(userId, limit = 5) {
    return await prisma.interview.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        role: true,
        difficulty: true,
        status: true,
        createdAt: true,
        completedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  },

  /**
   * Get recent reports for a user
   * 
   * @param {string} userId - User ID
   * @param {number} limit - Number of reports to fetch (default: 5)
   * @returns {Promise<Array>} Recent reports
   */
  async getRecentReports(userId, limit = 5) {
    return await prisma.report.findMany({
      where: { userId },
      select: {
        id: true,
        interviewId: true,
        overallScore: true,
        createdAt: true,
        interview: {
          select: {
            title: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  },

  /**
   * Get latest resume for a user
   * 
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Latest resume or null
   */
  async getLatestResume(userId) {
    return await prisma.resume.findFirst({
      where: { userId },
      select: {
        id: true,
        fileName: true,
        fileUrl: true,
        fileSize: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  /**
   * Get complete dashboard data for a user
   * 
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Complete dashboard data
   */
  async getCompleteDashboard(userId) {
    // Run all dashboard queries in parallel
    const [stats, analytics, recentInterviews, recentReports, latestResume] = await Promise.all([
      this.getDashboardStats(userId),
      this.getDashboardAnalytics(userId),
      this.getRecentInterviews(userId, 5),
      this.getRecentReports(userId, 5),
      this.getLatestResume(userId),
    ]);

    return {
      stats,
      analytics,
      recentActivity: {
        interviews: recentInterviews,
        reports: recentReports,
        latestResume,
      },
    };
  },
};
