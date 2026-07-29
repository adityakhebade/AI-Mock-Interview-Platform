import prisma from '../config/prisma.js';

/**
 * Evaluation Repository
 * 
 * Handles all database operations for Evaluation model.
 * Only this layer can access Prisma for Evaluation operations.
 */

export const evaluationRepository = {
  /**
   * Create an evaluation
   * 
   * @param {Object} evaluationData - Evaluation data
   * @returns {Promise<Object>} Created evaluation object
   */
  async createEvaluation(evaluationData) {
    return await prisma.evaluation.create({
      data: evaluationData,
      include: {
        interview: {
          select: {
            id: true,
            title: true,
            userId: true,
            status: true,
            role: true,
            difficulty: true,
          },
        },
      },
    });
  },

  /**
   * Find evaluation by interview ID
   * 
   * @param {string} interviewId - Interview ID
   * @returns {Promise<Object|null>} Evaluation object or null
   */
  async findByInterviewId(interviewId) {
    return await prisma.evaluation.findUnique({
      where: { interviewId },
      include: {
        interview: {
          select: {
            id: true,
            title: true,
            userId: true,
            status: true,
            role: true,
            difficulty: true,
          },
        },
      },
    });
  },

  /**
   * Find all evaluations for a user
   * 
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of evaluation objects
   */
  async findByUserId(userId) {
    return await prisma.evaluation.findMany({
      where: {
        interview: {
          userId,
        },
      },
      include: {
        interview: {
          select: {
            id: true,
            title: true,
            userId: true,
            status: true,
            role: true,
            difficulty: true,
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
   * Update evaluation
   * 
   * @param {string} interviewId - Interview ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated evaluation object
   */
  async updateEvaluation(interviewId, updateData) {
    return await prisma.evaluation.update({
      where: { interviewId },
      data: updateData,
      include: {
        interview: {
          select: {
            id: true,
            title: true,
            userId: true,
            status: true,
            role: true,
            difficulty: true,
          },
        },
      },
    });
  },

  /**
   * Delete evaluation
   * 
   * @param {string} interviewId - Interview ID
   * @returns {Promise<Object>} Deleted evaluation object
   */
  async deleteEvaluation(interviewId) {
    return await prisma.evaluation.delete({
      where: { interviewId },
    });
  },

  /**
   * Count evaluations for a user
   * 
   * @param {string} userId - User ID
   * @returns {Promise<number>} Count of evaluations
   */
  async countByUserId(userId) {
    return await prisma.evaluation.count({
      where: {
        interview: {
          userId,
        },
      },
    });
  },
};
