import { interviewRepository } from '../repositories/interview.repository.js';
import { resumeRepository } from '../repositories/resume.repository.js';
import AppError from '../utils/AppError.js';

/**
 * Interview Service
 * 
 * Handles business logic for interview management.
 * Manages interview status transitions and ownership verification.
 */

export const interviewService = {
  /**
   * Create a new interview
   * 
   * @param {string} userId - User ID from authenticated user
   * @param {Object} interviewData - Interview data
   * @returns {Promise<Object>} Created interview object
   */
  async createInterview(userId, interviewData) {
    // Verify resume ownership if resumeId is provided
    if (interviewData.resumeId) {
      const resume = await resumeRepository.findByIdAndUserId(
        interviewData.resumeId,
        userId
      );

      if (!resume) {
        throw new AppError('Resume not found or does not belong to you', 404);
      }
    }

    // Prepare interview data
    const interview = await interviewRepository.createInterview({
      ...interviewData,
      userId,
      status: 'DRAFT', // Always start as DRAFT
    });

    return this.formatInterviewResponse(interview);
  },

  /**
   * Get interview by ID
   * 
   * @param {string} interviewId - Interview ID
   * @param {string} userId - User ID for ownership verification
   * @returns {Promise<Object>} Interview object
   */
  async getInterview(interviewId, userId) {
    const interview = await interviewRepository.findByIdAndUserId(
      interviewId,
      userId
    );

    if (!interview) {
      throw new AppError('Interview not found or access denied', 404);
    }

    return this.formatInterviewResponse(interview);
  },

  /**
   * List all interviews for a user
   * 
   * @param {string} userId - User ID
   * @param {Object} filters - Optional filters (status)
   * @returns {Promise<Array>} Array of interview objects
   */
  async listInterviews(userId, filters = {}) {
    const interviews = await interviewRepository.findByUserId(userId, filters);
    return interviews.map((interview) =>
      this.formatInterviewResponse(interview)
    );
  },

  /**
   * Update interview
   * Can only update interviews in DRAFT status
   * 
   * @param {string} interviewId - Interview ID
   * @param {string} userId - User ID for ownership verification
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated interview object
   */
  async updateInterview(interviewId, userId, updateData) {
    // Verify ownership
    const interview = await interviewRepository.findByIdAndUserId(
      interviewId,
      userId
    );

    if (!interview) {
      throw new AppError('Interview not found or access denied', 404);
    }

    // Only allow updates for DRAFT interviews
    if (interview.status !== 'DRAFT') {
      throw new AppError(
        'Cannot update interview that is not in DRAFT status',
        400
      );
    }

    // If resumeId is being updated, verify it belongs to user
    if (updateData.resumeId && updateData.resumeId !== interview.resumeId) {
      const resume = await resumeRepository.findByIdAndUserId(
        updateData.resumeId,
        userId
      );

      if (!resume) {
        throw new AppError('Resume not found or does not belong to you', 404);
      }
    }

    // Remove fields that shouldn't be updated directly
    const { status, userId: _, ...allowedUpdates } = updateData;

    const updatedInterview = await interviewRepository.updateInterview(
      interviewId,
      allowedUpdates
    );

    return this.formatInterviewResponse(updatedInterview);
  },

  /**
   * Delete interview
   * 
   * @param {string} interviewId - Interview ID
   * @param {string} userId - User ID for ownership verification
   * @returns {Promise<Object>} Success message
   */
  async deleteInterview(interviewId, userId) {
    // Verify ownership
    const interview = await interviewRepository.findByIdAndUserId(
      interviewId,
      userId
    );

    if (!interview) {
      throw new AppError('Interview not found or access denied', 404);
    }

    await interviewRepository.deleteInterview(interviewId);

    return {
      message: 'Interview deleted successfully',
    };
  },

  /**
   * Start interview
   * Transitions from DRAFT to IN_PROGRESS
   * 
   * @param {string} interviewId - Interview ID
   * @param {string} userId - User ID for ownership verification
   * @returns {Promise<Object>} Updated interview object
   */
  async startInterview(interviewId, userId) {
    // Verify ownership
    const interview = await interviewRepository.findByIdAndUserId(
      interviewId,
      userId
    );

    if (!interview) {
      throw new AppError('Interview not found or access denied', 404);
    }

    // Validate status transition
    if (interview.status !== 'DRAFT') {
      throw new AppError(
        `Cannot start interview in ${interview.status} status. Only DRAFT interviews can be started.`,
        400
      );
    }

    // Update status to IN_PROGRESS and set startedAt
    const updatedInterview = await interviewRepository.updateStatus(
      interviewId,
      'IN_PROGRESS',
      {
        startedAt: new Date(),
      }
    );

    return this.formatInterviewResponse(updatedInterview);
  },

  /**
   * Complete interview
   * Transitions from IN_PROGRESS to COMPLETED
   * 
   * @param {string} interviewId - Interview ID
   * @param {string} userId - User ID for ownership verification
   * @returns {Promise<Object>} Updated interview object
   */
  async completeInterview(interviewId, userId) {
    // Verify ownership
    const interview = await interviewRepository.findByIdAndUserId(
      interviewId,
      userId
    );

    if (!interview) {
      throw new AppError('Interview not found or access denied', 404);
    }

    // Validate status transition
    if (interview.status !== 'IN_PROGRESS') {
      throw new AppError(
        `Cannot complete interview in ${interview.status} status. Only IN_PROGRESS interviews can be completed.`,
        400
      );
    }

    // Update status to COMPLETED and set completedAt
    const updatedInterview = await interviewRepository.updateStatus(
      interviewId,
      'COMPLETED',
      {
        completedAt: new Date(),
      }
    );

    return this.formatInterviewResponse(updatedInterview);
  },

  /**
   * Format interview for API response
   * 
   * @param {Object} interview - Interview object from database
   * @returns {Object} Formatted interview object
   */
  formatInterviewResponse(interview) {
    return {
      id: interview.id,
      userId: interview.userId,
      resumeId: interview.resumeId,
      title: interview.title,
      role: interview.role,
      difficulty: interview.difficulty,
      language: interview.language,
      duration: interview.duration,
      status: interview.status,
      startedAt: interview.startedAt,
      completedAt: interview.completedAt,
      createdAt: interview.createdAt,
      updatedAt: interview.updatedAt,
      resume: interview.resume
        ? {
            id: interview.resume.id,
            fileName: interview.resume.fileName,
            fileUrl: interview.resume.fileUrl,
          }
        : null,
      user: interview.user
        ? {
            id: interview.user.id,
            name: interview.user.name,
            email: interview.user.email,
          }
        : undefined,
    };
  },
};
