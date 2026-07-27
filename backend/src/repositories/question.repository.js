import prisma from '../config/prisma.js';

/**
 * Question Repository
 * 
 * Handles all database operations for Question model.
 * Only this layer can access Prisma for Question operations.
 */

export const questionRepository = {
  /**
   * Create a single question
   * 
   * @param {Object} questionData - Question data
   * @returns {Promise<Object>} Created question object
   */
  async createQuestion(questionData) {
    return await prisma.question.create({
      data: questionData,
      include: {
        interview: {
          select: {
            id: true,
            title: true,
            userId: true,
          },
        },
      },
    });
  },

  /**
   * Create multiple questions at once (bulk insert for AI-generated questions)
   * 
   * @param {Array<Object>} questionsData - Array of question data objects
   * @returns {Promise<Object>} Result with count of created questions
   */
  async createManyQuestions(questionsData) {
    return await prisma.question.createMany({
      data: questionsData,
      skipDuplicates: true, // Skip if interviewId + order combination already exists
    });
  },

  /**
   * Find question by ID
   * 
   * @param {string} id - Question ID
   * @returns {Promise<Object|null>} Question object or null
   */
  async findById(id) {
    return await prisma.question.findUnique({
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
      },
    });
  },

  /**
   * Find all questions for an interview
   * 
   * @param {string} interviewId - Interview ID
   * @returns {Promise<Array>} Array of question objects ordered by order field
   */
  async findByInterviewId(interviewId) {
    return await prisma.question.findMany({
      where: { interviewId },
      orderBy: { order: 'asc' },
    });
  },

  /**
   * Update question
   * 
   * @param {string} id - Question ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated question object
   */
  async updateQuestion(id, updateData) {
    return await prisma.question.update({
      where: { id },
      data: updateData,
      include: {
        interview: {
          select: {
            id: true,
            title: true,
            userId: true,
          },
        },
      },
    });
  },

  /**
   * Delete question
   * 
   * @param {string} id - Question ID
   * @returns {Promise<Object>} Deleted question object
   */
  async deleteQuestion(id) {
    return await prisma.question.delete({
      where: { id },
    });
  },

  /**
   * Get the next order number for an interview
   * 
   * @param {string} interviewId - Interview ID
   * @returns {Promise<number>} Next order number
   */
  async getNextOrderNumber(interviewId) {
    const lastQuestion = await prisma.question.findFirst({
      where: { interviewId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    return lastQuestion ? lastQuestion.order + 1 : 1;
  },

  /**
   * Count questions for an interview
   * 
   * @param {string} interviewId - Interview ID
   * @returns {Promise<number>} Count of questions
   */
  async countByInterviewId(interviewId) {
    return await prisma.question.count({
      where: { interviewId },
    });
  },

  /**
   * Check if order number exists for an interview
   * 
   * @param {string} interviewId - Interview ID
   * @param {number} order - Order number
   * @param {string} excludeId - Question ID to exclude (for updates)
   * @returns {Promise<boolean>} True if order exists
   */
  async orderExists(interviewId, order, excludeId = null) {
    const where = {
      interviewId,
      order,
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const count = await prisma.question.count({ where });
    return count > 0;
  },
};
