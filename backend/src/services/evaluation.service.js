import { evaluationRepository } from '../repositories/evaluation.repository.js';
import { interviewRepository } from '../repositories/interview.repository.js';
import AppError from '../utils/AppError.js';

/**
 * Evaluation Service
 * 
 * Contains business logic for evaluation management.
 * Validates ownership and enforces business rules.
 */

export const evaluationService = {
  /**
   * Request or create an evaluation for a completed interview
   * 
   * @param {string} userId - Authenticated user ID
   * @param {string} interviewId - Interview ID
   * @param {Object} evaluationData - Evaluation data (score, strengths, weaknesses, feedback)
   * @returns {Promise<Object>} Created evaluation
   */
  async requestEvaluation(userId, interviewId, evaluationData) {
    // Verify interview exists and belongs to user
    const interview = await interviewRepository.findByIdAndUserId(interviewId, userId);
    if (!interview) {
      throw new AppError('Interview not found', 404);
    }

    // Interview must be completed
    if (interview.status !== 'COMPLETED') {
      throw new AppError('Interview must be completed before evaluation', 400);
    }

    // Check if evaluation already exists
    const existingEvaluation = await evaluationRepository.findByInterviewId(interviewId);
    if (existingEvaluation) {
      throw new AppError('Evaluation already exists for this interview', 409);
    }

    // Create evaluation
    const evaluation = await evaluationRepository.createEvaluation({
      interviewId,
      score: evaluationData.score,
      strengths: evaluationData.strengths,
      weaknesses: evaluationData.weaknesses,
      feedback: evaluationData.feedback,
    });

    return evaluation;
  },

  /**
   * Get evaluation for an interview
   * 
   * @param {string} userId - Authenticated user ID
   * @param {string} interviewId - Interview ID
   * @returns {Promise<Object>} Evaluation object
   */
  async getEvaluation(userId, interviewId) {
    // Get evaluation with interview info
    const evaluation = await evaluationRepository.findByInterviewId(interviewId);
    if (!evaluation) {
      throw new AppError('Evaluation not found', 404);
    }

    // Verify ownership through interview
    if (evaluation.interview.userId !== userId) {
      throw new AppError('Evaluation not found', 404);
    }

    return evaluation;
  },

  /**
   * List all evaluations for a user
   * 
   * @param {string} userId - Authenticated user ID
   * @returns {Promise<Object>} Evaluations array with total count
   */
  async listEvaluations(userId) {
    // Get evaluations
    const evaluations = await evaluationRepository.findByUserId(userId);

    return {
      evaluations,
      total: evaluations.length,
    };
  },

  /**
   * Update an existing evaluation
   * 
   * @param {string} userId - Authenticated user ID
   * @param {string} interviewId - Interview ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated evaluation
   */
  async updateEvaluation(userId, interviewId, updateData) {
    // Get evaluation with interview info
    const existingEvaluation = await evaluationRepository.findByInterviewId(interviewId);
    if (!existingEvaluation) {
      throw new AppError('Evaluation not found', 404);
    }

    // Verify ownership
    if (existingEvaluation.interview.userId !== userId) {
      throw new AppError('Evaluation not found', 404);
    }

    // Update evaluation
    const updatedEvaluation = await evaluationRepository.updateEvaluation(
      interviewId,
      {
        score: updateData.score !== undefined ? updateData.score : existingEvaluation.score,
        strengths: updateData.strengths !== undefined ? updateData.strengths : existingEvaluation.strengths,
        weaknesses: updateData.weaknesses !== undefined ? updateData.weaknesses : existingEvaluation.weaknesses,
        feedback: updateData.feedback !== undefined ? updateData.feedback : existingEvaluation.feedback,
      }
    );

    return updatedEvaluation;
  },

  /**
   * Delete an evaluation
   * 
   * @param {string} userId - Authenticated user ID
   * @param {string} interviewId - Interview ID
   * @returns {Promise<void>}
   */
  async deleteEvaluation(userId, interviewId) {
    // Get evaluation with interview info
    const existingEvaluation = await evaluationRepository.findByInterviewId(interviewId);
    if (!existingEvaluation) {
      throw new AppError('Evaluation not found', 404);
    }

    // Verify ownership
    if (existingEvaluation.interview.userId !== userId) {
      throw new AppError('Evaluation not found', 404);
    }

    // Delete evaluation
    await evaluationRepository.deleteEvaluation(interviewId);
  },
};
