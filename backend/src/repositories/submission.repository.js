import prisma from '../config/prisma.js';

/**
 * Submission Repository
 * 
 * Handles all database operations for Submission model.
 * Only this layer can access Prisma for Submission operations.
 */

export const submissionRepository = {
  /**
   * Create a submission
   * 
   * @param {Object} submissionData - Submission data
   * @returns {Promise<Object>} Created submission object
   */
  async createSubmission(submissionData) {
    return await prisma.submission.create({
      data: submissionData,
      include: {
        interview: {
          select: {
            id: true,
            title: true,
            userId: true,
            status: true,
          },
        },
        question: {
          select: {
            id: true,
            question: true,
            type: true,
            difficulty: true,
            order: true,
          },
        },
      },
    });
  },

  /**
   * Find submission by ID
   * 
   * @param {string} id - Submission ID
   * @returns {Promise<Object|null>} Submission object or null
   */
  async findById(id) {
    return await prisma.submission.findUnique({
      where: { id },
      include: {
        interview: {
          select: {
            id: true,
            title: true,
            userId: true,
            status: true,
          },
        },
        question: {
          select: {
            id: true,
            question: true,
            type: true,
            difficulty: true,
            order: true,
          },
        },
      },
    });
  },

  /**
   * Find submission by interview ID and question ID
   * 
   * @param {string} interviewId - Interview ID
   * @param {string} questionId - Question ID
   * @returns {Promise<Object|null>} Submission object or null
   */
  async findByInterviewAndQuestion(interviewId, questionId) {
    return await prisma.submission.findUnique({
      where: {
        interviewId_questionId: {
          interviewId,
          questionId,
        },
      },
      include: {
        interview: {
          select: {
            id: true,
            title: true,
            userId: true,
            status: true,
          },
        },
        question: {
          select: {
            id: true,
            question: true,
            type: true,
            difficulty: true,
            order: true,
          },
        },
      },
    });
  },

  /**
   * Find all submissions for an interview
   * 
   * @param {string} interviewId - Interview ID
   * @returns {Promise<Array>} Array of submission objects ordered by question order
   */
  async findByInterviewId(interviewId) {
    return await prisma.submission.findMany({
      where: { interviewId },
      include: {
        question: {
          select: {
            id: true,
            question: true,
            type: true,
            difficulty: true,
            order: true,
          },
        },
      },
      orderBy: {
        question: {
          order: 'asc',
        },
      },
    });
  },

  /**
   * Find submission by question ID
   * 
   * @param {string} questionId - Question ID
   * @returns {Promise<Object|null>} Submission object or null
   */
  async findByQuestionId(questionId) {
    return await prisma.submission.findFirst({
      where: { questionId },
      include: {
        interview: {
          select: {
            id: true,
            title: true,
            userId: true,
            status: true,
          },
        },
        question: {
          select: {
            id: true,
            question: true,
            type: true,
            difficulty: true,
            order: true,
          },
        },
      },
    });
  },

  /**
   * Update submission
   * 
   * @param {string} id - Submission ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated submission object
   */
  async updateSubmission(id, updateData) {
    return await prisma.submission.update({
      where: { id },
      data: updateData,
      include: {
        interview: {
          select: {
            id: true,
            title: true,
            userId: true,
            status: true,
          },
        },
        question: {
          select: {
            id: true,
            question: true,
            type: true,
            difficulty: true,
            order: true,
          },
        },
      },
    });
  },

  /**
   * Upsert submission (create or update if exists)
   * 
   * @param {string} interviewId - Interview ID
   * @param {string} questionId - Question ID
   * @param {Object} submissionData - Submission data
   * @returns {Promise<Object>} Created or updated submission object
   */
  async upsertSubmission(interviewId, questionId, submissionData) {
    return await prisma.submission.upsert({
      where: {
        interviewId_questionId: {
          interviewId,
          questionId,
        },
      },
      update: submissionData,
      create: {
        interviewId,
        questionId,
        ...submissionData,
      },
      include: {
        interview: {
          select: {
            id: true,
            title: true,
            userId: true,
            status: true,
          },
        },
        question: {
          select: {
            id: true,
            question: true,
            type: true,
            difficulty: true,
            order: true,
          },
        },
      },
    });
  },

  /**
   * Delete submission
   * 
   * @param {string} id - Submission ID
   * @returns {Promise<Object>} Deleted submission object
   */
  async deleteSubmission(id) {
    return await prisma.submission.delete({
      where: { id },
    });
  },

  /**
   * Count submissions for an interview
   * 
   * @param {string} interviewId - Interview ID
   * @returns {Promise<number>} Count of submissions
   */
  async countByInterviewId(interviewId) {
    return await prisma.submission.count({
      where: { interviewId },
    });
  },
};
