import prisma from '../config/prisma.js';

/**
 * Report Repository
 * 
 * Handles all database operations for Report model.
 * Only this layer can access Prisma for Report operations.
 */

export const reportRepository = {
  /**
   * Create a report
   * 
   * @param {Object} reportData - Report data
   * @returns {Promise<Object>} Created report object
   */
  async createReport(reportData) {
    return await prisma.report.create({
      data: reportData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        interview: {
          select: {
            id: true,
            title: true,
            role: true,
            difficulty: true,
            status: true,
            completedAt: true,
          },
        },
      },
    });
  },

  /**
   * Find report by ID
   * 
   * @param {string} reportId - Report ID
   * @returns {Promise<Object|null>} Report object or null
   */
  async findById(reportId) {
    return await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        interview: {
          select: {
            id: true,
            title: true,
            role: true,
            difficulty: true,
            status: true,
            completedAt: true,
          },
        },
      },
    });
  },

  /**
   * Find report by interview ID
   * 
   * @param {string} interviewId - Interview ID
   * @returns {Promise<Object|null>} Report object or null
   */
  async findByInterviewId(interviewId) {
    return await prisma.report.findUnique({
      where: { interviewId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        interview: {
          select: {
            id: true,
            title: true,
            role: true,
            difficulty: true,
            status: true,
            completedAt: true,
          },
        },
      },
    });
  },

  /**
   * Find all reports for a user
   * 
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of report objects
   */
  async findByUserId(userId) {
    return await prisma.report.findMany({
      where: { userId },
      include: {
        interview: {
          select: {
            id: true,
            title: true,
            role: true,
            difficulty: true,
            status: true,
            completedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  /**
   * Delete report
   * 
   * @param {string} reportId - Report ID
   * @returns {Promise<Object>} Deleted report object
   */
  async deleteReport(reportId) {
    return await prisma.report.delete({
      where: { id: reportId },
    });
  },

  /**
   * Count reports for a user
   * 
   * @param {string} userId - User ID
   * @returns {Promise<number>} Count of reports
   */
  async countByUserId(userId) {
    return await prisma.report.count({
      where: { userId },
    });
  },
};
