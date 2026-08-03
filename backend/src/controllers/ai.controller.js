import { aiService } from '../services/ai.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import AppError from '../utils/AppError.js';

/**
 * AI Controller
 * 
 * Handles HTTP requests for AI operations.
 * Delegates business logic to the AI service.
 */

export const aiController = {
  /**
   * Generate interview questions
   * POST /api/v1/ai/questions
   */
  generateQuestions: asyncHandler(async (req, res) => {
    const { role, difficulty, count, resumeText } = req.body;

    const result = await aiService.generateQuestions({
      role,
      difficulty,
      count,
      resumeText,
    });

    sendSuccess(res, result, 'Questions generated successfully');
  }),

  /**
   * Evaluate interview submissions
   * POST /api/v1/ai/evaluate
   */
  evaluateInterview: asyncHandler(async (req, res) => {
    const { role, difficulty, questionsAndAnswers } = req.body;

    const result = await aiService.evaluateInterview({
      role,
      difficulty,
      questionsAndAnswers,
    });

    sendSuccess(res, result, 'Interview evaluated successfully');
  }),

  /**
   * Analyze resume
   * POST /api/v1/ai/resume-analysis
   */
  analyzeResume: asyncHandler(async (req, res) => {
    const { resumeText, targetRole } = req.body;

    const result = await aiService.analyzeResume({
      resumeText,
      targetRole,
    });

    sendSuccess(res, result, 'Resume analyzed successfully');
  }),

  /**
   * Check AI service health
   * GET /api/v1/ai/health
   */
  checkHealth: asyncHandler(async (req, res) => {
    const health = await aiService.checkHealth();

    sendSuccess(res, health);
  }),
};
