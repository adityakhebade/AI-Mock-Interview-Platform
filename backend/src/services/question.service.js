import { questionRepository } from '../repositories/question.repository.js';
import { interviewRepository } from '../repositories/interview.repository.js';
import AppError from '../utils/AppError.js';

/**
 * Question Service
 * 
 * Contains business logic for question management.
 * Validates ownership and enforces business rules.
 */

export const questionService = {
  /**
   * Create a new question for an interview
   * 
   * @param {string} userId - Authenticated user ID
   * @param {Object} questionData - Question data
   * @returns {Promise<Object>} Created question
   */
  async createQuestion(userId, questionData) {
    const { interviewId, question, type, difficulty, order } = questionData;

    // Verify interview exists and belongs to user
    const interview = await interviewRepository.findByIdAndUserId(interviewId, userId);
    if (!interview) {
      throw new AppError('Interview not found', 404);
    }

    // Prevent modifying completed interviews
    if (interview.status === 'COMPLETED') {
      throw new AppError('Cannot add questions to completed interview', 400);
    }

    // Get next order number if not provided
    let questionOrder = order;
    if (questionOrder === undefined || questionOrder === null) {
      questionOrder = await questionRepository.getNextOrderNumber(interviewId);
    } else {
      // Check if order already exists
      const orderExists = await questionRepository.orderExists(interviewId, questionOrder);
      if (orderExists) {
        throw new AppError(`Question with order ${questionOrder} already exists for this interview`, 400);
      }
    }

    // Create question
    const createdQuestion = await questionRepository.createQuestion({
      interviewId,
      question,
      type,
      difficulty,
      order: questionOrder,
    });

    return createdQuestion;
  },

  /**
   * Create multiple questions at once (bulk insert for AI-generated questions)
   * 
   * @param {string} userId - Authenticated user ID
   * @param {string} interviewId - Interview ID
   * @param {Array<Object>} questions - Array of question objects
   * @returns {Promise<Object>} Result with count and created questions
   */
  async createManyQuestions(userId, interviewId, questions) {
    // Verify interview exists and belongs to user
    const interview = await interviewRepository.findByIdAndUserId(interviewId, userId);
    if (!interview) {
      throw new AppError('Interview not found', 404);
    }

    // Prevent modifying completed interviews
    if (interview.status === 'COMPLETED') {
      throw new AppError('Cannot add questions to completed interview', 400);
    }

    // Get next order number
    let nextOrder = await questionRepository.getNextOrderNumber(interviewId);

    // Prepare questions with order numbers
    const questionsWithOrder = questions.map((q) => ({
      interviewId,
      question: q.question,
      type: q.type,
      difficulty: q.difficulty,
      order: q.order !== undefined ? q.order : nextOrder++,
    }));

    // Create questions in bulk
    const result = await questionRepository.createManyQuestions(questionsWithOrder);

    // Fetch created questions to return
    const createdQuestions = await questionRepository.findByInterviewId(interviewId);

    return {
      count: result.count,
      questions: createdQuestions,
    };
  },

  /**
   * Get all questions for an interview
   * 
   * @param {string} userId - Authenticated user ID
   * @param {string} interviewId - Interview ID
   * @returns {Promise<Object>} Questions array with total count
   */
  async getInterviewQuestions(userId, interviewId) {
    // Verify interview exists and belongs to user
    const interview = await interviewRepository.findByIdAndUserId(interviewId, userId);
    if (!interview) {
      throw new AppError('Interview not found', 404);
    }

    // Get questions
    const questions = await questionRepository.findByInterviewId(interviewId);

    return {
      questions,
      total: questions.length,
    };
  },

  /**
   * Get a single question by ID
   * 
   * @param {string} userId - Authenticated user ID
   * @param {string} questionId - Question ID
   * @returns {Promise<Object>} Question object
   */
  async getQuestion(userId, questionId) {
    // Get question with interview info
    const question = await questionRepository.findById(questionId);
    if (!question) {
      throw new AppError('Question not found', 404);
    }

    // Verify ownership through interview
    if (question.interview.userId !== userId) {
      throw new AppError('Question not found', 404);
    }

    return question;
  },

  /**
   * Update a question
   * 
   * @param {string} userId - Authenticated user ID
   * @param {string} questionId - Question ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated question
   */
  async updateQuestion(userId, questionId, updateData) {
    // Get question with interview info
    const existingQuestion = await questionRepository.findById(questionId);
    if (!existingQuestion) {
      throw new AppError('Question not found', 404);
    }

    // Verify ownership
    if (existingQuestion.interview.userId !== userId) {
      throw new AppError('Question not found', 404);
    }

    // Prevent modifying completed interviews
    if (existingQuestion.interview.status === 'COMPLETED') {
      throw new AppError('Cannot update questions in completed interview', 400);
    }

    // If updating order, check for conflicts
    if (updateData.order !== undefined && updateData.order !== existingQuestion.order) {
      const orderExists = await questionRepository.orderExists(
        existingQuestion.interviewId,
        updateData.order,
        questionId
      );
      if (orderExists) {
        throw new AppError(`Question with order ${updateData.order} already exists for this interview`, 400);
      }
    }

    // Update question
    const updatedQuestion = await questionRepository.updateQuestion(questionId, updateData);

    return updatedQuestion;
  },

  /**
   * Delete a question
   * 
   * @param {string} userId - Authenticated user ID
   * @param {string} questionId - Question ID
   * @returns {Promise<void>}
   */
  async deleteQuestion(userId, questionId) {
    // Get question with interview info
    const existingQuestion = await questionRepository.findById(questionId);
    if (!existingQuestion) {
      throw new AppError('Question not found', 404);
    }

    // Verify ownership
    if (existingQuestion.interview.userId !== userId) {
      throw new AppError('Question not found', 404);
    }

    // Prevent modifying completed interviews
    if (existingQuestion.interview.status === 'COMPLETED') {
      throw new AppError('Cannot delete questions from completed interview', 400);
    }

    // Delete question
    await questionRepository.deleteQuestion(questionId);
  },
};
