import { submissionRepository } from '../repositories/submission.repository.js';
import { interviewRepository } from '../repositories/interview.repository.js';
import { questionRepository } from '../repositories/question.repository.js';
import AppError from '../utils/AppError.js';

/**
 * Submission Service
 * 
 * Contains business logic for submission management.
 * Validates ownership and enforces business rules.
 */

export const submissionService = {
  /**
   * Save or update a submission (auto-save functionality)
   * 
   * @param {string} userId - Authenticated user ID
   * @param {Object} submissionData - Submission data
   * @returns {Promise<Object>} Created or updated submission
   */
  async saveSubmission(userId, submissionData) {
    const { interviewId, questionId, answer, code, language } = submissionData;

    // Verify interview exists and belongs to user
    const interview = await interviewRepository.findByIdAndUserId(interviewId, userId);
    if (!interview) {
      throw new AppError('Interview not found', 404);
    }

    // Interview must be in progress
    if (interview.status !== 'IN_PROGRESS') {
      throw new AppError('Interview must be in progress to submit answers', 400);
    }

    // Verify question exists and belongs to the interview
    const question = await questionRepository.findById(questionId);
    if (!question || question.interview.id !== interviewId) {
      throw new AppError('Question not found in this interview', 404);
    }

    // Upsert submission (create or update)
    const submission = await submissionRepository.upsertSubmission(
      interviewId,
      questionId,
      {
        answer: answer || null,
        code: code || null,
        language: language || null,
      }
    );

    return submission;
  },

  /**
   * Update an existing submission
   * 
   * @param {string} userId - Authenticated user ID
   * @param {string} submissionId - Submission ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated submission
   */
  async updateSubmission(userId, submissionId, updateData) {
    // Get submission with interview details
    const existingSubmission = await submissionRepository.findById(submissionId);
    if (!existingSubmission) {
      throw new AppError('Submission not found', 404);
    }

    // Verify ownership through interview
    if (existingSubmission.interview.userId !== userId) {
      throw new AppError('Submission not found', 404);
    }

    // Interview must be in progress
    if (existingSubmission.interview.status !== 'IN_PROGRESS') {
      throw new AppError('Cannot update submission after interview completion', 400);
    }

    // Update submission
    const updatedSubmission = await submissionRepository.updateSubmission(
      submissionId,
      {
        answer: updateData.answer !== undefined ? updateData.answer : existingSubmission.answer,
        code: updateData.code !== undefined ? updateData.code : existingSubmission.code,
        language: updateData.language !== undefined ? updateData.language : existingSubmission.language,
      }
    );

    return updatedSubmission;
  },

  /**
   * Get all submissions for an interview
   * 
   * @param {string} userId - Authenticated user ID
   * @param {string} interviewId - Interview ID
   * @returns {Promise<Object>} Submissions array with total count
   */
  async listSubmissions(userId, interviewId) {
    // Verify interview exists and belongs to user
    const interview = await interviewRepository.findByIdAndUserId(interviewId, userId);
    if (!interview) {
      throw new AppError('Interview not found', 404);
    }

    // Get submissions
    const submissions = await submissionRepository.findByInterviewId(interviewId);

    return {
      submissions,
      total: submissions.length,
    };
  },

  /**
   * Get a single submission by ID
   * 
   * @param {string} userId - Authenticated user ID
   * @param {string} submissionId - Submission ID
   * @returns {Promise<Object>} Submission object
   */
  async getSubmission(userId, submissionId) {
    // Get submission with interview info
    const submission = await submissionRepository.findById(submissionId);
    if (!submission) {
      throw new AppError('Submission not found', 404);
    }

    // Verify ownership through interview
    if (submission.interview.userId !== userId) {
      throw new AppError('Submission not found', 404);
    }

    return submission;
  },

  /**
   * Delete a submission
   * 
   * @param {string} userId - Authenticated user ID
   * @param {string} submissionId - Submission ID
   * @returns {Promise<void>}
   */
  async deleteSubmission(userId, submissionId) {
    // Get submission with interview info
    const existingSubmission = await submissionRepository.findById(submissionId);
    if (!existingSubmission) {
      throw new AppError('Submission not found', 404);
    }

    // Verify ownership
    if (existingSubmission.interview.userId !== userId) {
      throw new AppError('Submission not found', 404);
    }

    // Interview must be in progress
    if (existingSubmission.interview.status !== 'IN_PROGRESS') {
      throw new AppError('Cannot delete submission after interview completion', 400);
    }

    // Delete submission
    await submissionRepository.deleteSubmission(submissionId);
  },
};
