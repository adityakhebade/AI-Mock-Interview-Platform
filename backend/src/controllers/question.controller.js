import { questionService } from '../services/question.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

/**
 * Question Controller
 * 
 * Handles HTTP requests for question operations.
 * Delegates business logic to the question service.
 */

export const questionController = {
  /**
   * Create a new question
   * POST /api/v1/questions
   */
  create: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const questionData = req.body;

    const question = await questionService.createQuestion(userId, questionData);

    sendSuccess(res, { question }, 'Question created successfully', 201);
  }),

  /**
   * Create multiple questions (bulk insert)
   * POST /api/v1/questions/bulk
   */
  createBulk: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { interviewId, questions } = req.body;

    const result = await questionService.createManyQuestions(userId, interviewId, questions);

    sendSuccess(res, result, `${result.count} questions created successfully`, 201);
  }),

  /**
   * Get all questions for an interview
   * GET /api/v1/questions/interview/:interviewId
   */
  listByInterview: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { interviewId } = req.params;

    const result = await questionService.getInterviewQuestions(userId, interviewId);

    sendSuccess(res, result);
  }),

  /**
   * Get a single question
   * GET /api/v1/questions/:id
   */
  get: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    const question = await questionService.getQuestion(userId, id);

    sendSuccess(res, { question });
  }),

  /**
   * Update a question
   * PATCH /api/v1/questions/:id
   */
  update: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const updateData = req.body;

    const question = await questionService.updateQuestion(userId, id, updateData);

    sendSuccess(res, { question }, 'Question updated successfully');
  }),

  /**
   * Delete a question
   * DELETE /api/v1/questions/:id
   */
  remove: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    await questionService.deleteQuestion(userId, id);

    sendSuccess(res, null, 'Question deleted successfully');
  }),
};
