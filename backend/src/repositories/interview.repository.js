import prisma from '../config/prisma.js';

/**
 * Interview Repository
 * 
 * Handles all database operations for Interview model.
 * Only this layer can access Prisma for Interview operations.
 */

export const interviewRepository = {
  /**
   * Create a new interview
   * 
   * @param {Object} interviewData - Interview data
   * @returns {Promise<Object>} Created interview object
   */
  async createInterview(interviewData) {
    return await prisma.interview.create({
      data: interviewData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        resume: {
          select: {
            id: true,
            fileName: true,
          },
        },
      },
    });
  },

  /**
   * Find interview by ID
   * 
   * @param {string} id - Interview ID
   * @returns {Promise<Object|null>} Interview object or null
   */
  async findById(id) {
    return await prisma.interview.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        resume: {
          select: {
            id: true,
            fileName: true,
            fileUrl: true,
          },
        },
      },
    });
  },

  /**
   * Find interview by ID and user ID (for ownership verification)
   * 
   * @param {string} id - Interview ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Interview object or null
   */
  async findByIdAndUserId(id, userId) {
    return await prisma.interview.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        resume: {
          select: {
            id: true,
            fileName: true,
            fileUrl: true,
          },
        },
      },
    });
  },

  /**
   * Find all interviews for a user
   * 
   * @param {string} userId - User ID
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} Array of interview objects
   */
  async findByUserId(userId, filters = {}) {
    const where = { userId };

    // Add status filter if provided
    if (filters.status) {
      where.status = filters.status;
    }

    return await prisma.interview.findMany({
      where,
      include: {
        resume: {
          select: {
            id: true,
            fileName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Update interview
   * 
   * @param {string} id - Interview ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated interview object
   */
  async updateInterview(id, updateData) {
    return await prisma.interview.update({
      where: { id },
      data: updateData,
      include: {
        resume: {
          select: {
            id: true,
            fileName: true,
            fileUrl: true,
          },
        },
      },
    });
  },

  /**
   * Delete interview
   * 
   * @param {string} id - Interview ID
   * @returns {Promise<Object>} Deleted interview object
   */
  async deleteInterview(id) {
    return await prisma.interview.delete({
      where: { id },
    });
  },

  /**
   * Update interview status
   * 
   * @param {string} id - Interview ID
   * @param {string} status - New status
   * @param {Object} additionalData - Additional fields to update (e.g., startedAt, completedAt)
   * @returns {Promise<Object>} Updated interview object
   */
  async updateStatus(id, status, additionalData = {}) {
    return await prisma.interview.update({
      where: { id },
      data: {
        status,
        ...additionalData,
      },
      include: {
        resume: {
          select: {
            id: true,
            fileName: true,
          },
        },
      },
    });
  },

  /**
   * Count user's interviews
   * 
   * @param {string} userId - User ID
   * @param {Object} filters - Optional filters
   * @returns {Promise<number>} Count of interviews
   */
  async countByUserId(userId, filters = {}) {
    const where = { userId };

    if (filters.status) {
      where.status = filters.status;
    }

    return await prisma.interview.count({ where });
  },
};
