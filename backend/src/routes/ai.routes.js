import express from 'express';
import { aiController } from '../controllers/ai.controller.js';
import { requireAuthentication } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  generateQuestionsSchema,
  evaluateInterviewSchema,
  analyzeResumeSchema,
} from '../validations/ai.validation.js';

const router = express.Router();

/**
 * AI Routes
 * 
 * All routes require authentication.
 * Base path: /api/v1/ai
 */

// Apply authentication middleware to all routes
router.use(requireAuthentication);

/**
 * GET /api/v1/ai/health
 * Check AI service health status
 */
router.get('/health', aiController.checkHealth);

/**
 * POST /api/v1/ai/questions
 * Generate interview questions using AI
 */
router.post(
  '/questions',
  validate(generateQuestionsSchema),
  aiController.generateQuestions
);

/**
 * POST /api/v1/ai/evaluate
 * Evaluate interview submissions using AI
 */
router.post(
  '/evaluate',
  validate(evaluateInterviewSchema),
  aiController.evaluateInterview
);

/**
 * POST /api/v1/ai/resume-analysis
 * Analyze resume using AI
 */
router.post(
  '/resume-analysis',
  validate(analyzeResumeSchema),
  aiController.analyzeResume
);

export default router;
