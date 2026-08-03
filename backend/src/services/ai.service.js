import { z } from 'zod';
import { geminiService } from './gemini.service.js';
import { aiParser } from '../utils/aiParser.js';
import { questionPrompt } from '../prompts/question.prompt.js';
import { evaluationPrompt } from '../prompts/evaluation.prompt.js';
import { resumePrompt } from '../prompts/resume.prompt.js';
import AppError from '../utils/AppError.js';

/**
 * AI Service
 * 
 * High-level service for AI operations.
 * Coordinates AI requests, prompt generation, and response parsing.
 */

// Validation Schemas
const questionSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().min(10),
      type: z.enum(['TECHNICAL', 'CODING', 'BEHAVIORAL', 'MCQ', 'HR']),
      difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
      order: z.number().int().positive(),
    })
  ).min(1),
});

const evaluationSchema = z.object({
  score: z.number().int().min(0).max(100),
  strengths: z.string().min(50),
  weaknesses: z.string().min(50),
  feedback: z.string().min(100),
});

const resumeAnalysisSchema = z.object({
  skills: z.array(z.string()).min(1),
  yearsOfExperience: z.number().int().min(0).optional(),
  technologies: z.array(z.string()),
  workExperience: z.string(),
  education: z.string(),
  achievements: z.array(z.string()),
  summary: z.string().min(50),
  strengths: z.string(),
  recommendations: z.string(),
  roleFit: z.string().optional(),
});

export const aiService = {
  /**
   * Check if AI service is available
   * 
   * @returns {boolean} True if AI is configured
   */
  isAvailable() {
    return geminiService.isConfigured();
  },

  /**
   * Generate interview questions
   * 
   * @param {Object} params - Question generation parameters
   * @param {string} params.role - Job role
   * @param {string} params.difficulty - Difficulty level
   * @param {number} [params.count=10] - Number of questions
   * @param {string} [params.resumeText] - Optional resume text
   * @returns {Promise<Object>} Generated questions
   */
  async generateQuestions({ role, difficulty, count = 10, resumeText }) {
    if (!this.isAvailable()) {
      throw new AppError('AI service is not configured', 503);
    }

    // Validate inputs
    if (!role || typeof role !== 'string') {
      throw new AppError('Valid role is required', 400);
    }

    if (!['EASY', 'MEDIUM', 'HARD'].includes(difficulty)) {
      throw new AppError('Difficulty must be EASY, MEDIUM, or HARD', 400);
    }

    if (count < 1 || count > 50) {
      throw new AppError('Question count must be between 1 and 50', 400);
    }

    try {
      // Generate prompt
      const prompt = questionPrompt.generate({ role, difficulty, count, resumeText });

      // Call AI with retry
      const response = await geminiService.generateWithRetry(prompt);

      // Parse and validate response
      const data = aiParser.parseAndValidate(response, questionSchema);

      // Ensure correct count (trim or add note if mismatch)
      if (data.questions.length > count) {
        data.questions = data.questions.slice(0, count);
      }

      return {
        questions: data.questions,
        metadata: {
          role,
          difficulty,
          requestedCount: count,
          generatedCount: data.questions.length,
          usedResume: !!resumeText,
        },
      };
    } catch (error) {
      console.error('Question Generation Error:', error.message);
      throw error instanceof AppError ? error : new AppError('Failed to generate questions', 500);
    }
  },

  /**
   * Evaluate interview submissions
   * 
   * @param {Object} params - Evaluation parameters
   * @param {string} params.role - Job role
   * @param {string} params.difficulty - Interview difficulty
   * @param {Array} params.questionsAndAnswers - Array of Q&A objects
   * @returns {Promise<Object>} Evaluation results
   */
  async evaluateInterview({ role, difficulty, questionsAndAnswers }) {
    if (!this.isAvailable()) {
      throw new AppError('AI service is not configured', 503);
    }

    // Validate inputs
    if (!role || typeof role !== 'string') {
      throw new AppError('Valid role is required', 400);
    }

    if (!['EASY', 'MEDIUM', 'HARD'].includes(difficulty)) {
      throw new AppError('Difficulty must be EASY, MEDIUM, or HARD', 400);
    }

    if (!Array.isArray(questionsAndAnswers) || questionsAndAnswers.length === 0) {
      throw new AppError('At least one question and answer is required', 400);
    }

    try {
      // Generate prompt
      const prompt = evaluationPrompt.generate({ role, difficulty, questionsAndAnswers });

      // Call AI with retry
      const response = await geminiService.generateWithRetry(prompt);

      // Parse and validate response
      const data = aiParser.parseAndValidate(response, evaluationSchema);

      return {
        score: data.score,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        feedback: data.feedback,
        metadata: {
          role,
          difficulty,
          questionCount: questionsAndAnswers.length,
        },
      };
    } catch (error) {
      console.error('Evaluation Error:', error.message);
      throw error instanceof AppError ? error : new AppError('Failed to evaluate interview', 500);
    }
  },

  /**
   * Analyze resume
   * 
   * @param {Object} params - Resume analysis parameters
   * @param {string} params.resumeText - Resume text content
   * @param {string} [params.targetRole] - Optional target role
   * @returns {Promise<Object>} Resume analysis results
   */
  async analyzeResume({ resumeText, targetRole }) {
    if (!this.isAvailable()) {
      throw new AppError('AI service is not configured', 503);
    }

    // Validate inputs
    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 100) {
      throw new AppError('Valid resume text is required (minimum 100 characters)', 400);
    }

    try {
      // Generate prompt
      const prompt = resumePrompt.generate({ resumeText, targetRole });

      // Call AI with retry
      const response = await geminiService.generateWithRetry(prompt);

      // Parse and validate response
      const data = aiParser.parseAndValidate(response, resumeAnalysisSchema);

      return {
        analysis: data,
        metadata: {
          targetRole: targetRole || null,
          resumeLength: resumeText.length,
        },
      };
    } catch (error) {
      console.error('Resume Analysis Error:', error.message);
      throw error instanceof AppError ? error : new AppError('Failed to analyze resume', 500);
    }
  },

  /**
   * Check AI service health
   * 
   * @returns {Promise<Object>} Health status
   */
  async checkHealth() {
    if (!this.isAvailable()) {
      return {
        status: 'unavailable',
        configured: false,
        message: 'AI service is not configured. Set GEMINI_API_KEY environment variable.',
      };
    }

    try {
      // Test with a simple prompt
      await geminiService.generateContent('Respond with "OK"', { timeout: 5000 });
      
      return {
        status: 'healthy',
        configured: true,
        message: 'AI service is operational',
      };
    } catch (error) {
      return {
        status: 'error',
        configured: true,
        message: 'AI service error: ' + error.message,
      };
    }
  },
};
