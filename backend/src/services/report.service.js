import { reportRepository } from '../repositories/report.repository.js';
import { evaluationRepository } from '../repositories/evaluation.repository.js';
import { interviewRepository } from '../repositories/interview.repository.js';
import AppError from '../utils/AppError.js';

/**
 * Report Service
 * 
 * Contains business logic for report management.
 * Validates ownership and enforces business rules.
 */

export const reportService = {
  /**
   * Generate a report from an existing evaluation
   * 
   * @param {string} userId - Authenticated user ID
   * @param {string} interviewId - Interview ID
   * @returns {Promise<Object>} Created report
   */
  async generateReport(userId, interviewId) {
    // Verify interview exists and belongs to user
    const interview = await interviewRepository.findByIdAndUserId(interviewId, userId);
    if (!interview) {
      throw new AppError('Interview not found', 404);
    }

    // Interview must be completed
    if (interview.status !== 'COMPLETED') {
      throw new AppError('Interview must be completed before generating report', 400);
    }

    // Check if evaluation exists
    const evaluation = await evaluationRepository.findByInterviewId(interviewId);
    if (!evaluation) {
      throw new AppError('Evaluation not found. Please create an evaluation first.', 404);
    }

    // Check if report already exists
    const existingReport = await reportRepository.findByInterviewId(interviewId);
    if (existingReport) {
      throw new AppError('Report already exists for this interview', 409);
    }

    // Generate report from evaluation data
    const report = await reportRepository.createReport({
      userId,
      interviewId,
      overallScore: evaluation.score,
      summary: this._generateSummary(evaluation, interview),
      recommendation: this._generateRecommendation(evaluation.score, evaluation.strengths, evaluation.weaknesses),
    });

    return report;
  },

  /**
   * Get report by ID
   * 
   * @param {string} userId - Authenticated user ID
   * @param {string} reportId - Report ID
   * @returns {Promise<Object>} Report object
   */
  async getReport(userId, reportId) {
    const report = await reportRepository.findById(reportId);
    if (!report) {
      throw new AppError('Report not found', 404);
    }

    // Verify ownership
    if (report.userId !== userId) {
      throw new AppError('Report not found', 404);
    }

    return report;
  },

  /**
   * List all reports for a user
   * 
   * @param {string} userId - Authenticated user ID
   * @returns {Promise<Object>} Reports array with total count
   */
  async listReports(userId) {
    const reports = await reportRepository.findByUserId(userId);

    return {
      reports,
      total: reports.length,
    };
  },

  /**
   * Delete a report
   * 
   * @param {string} userId - Authenticated user ID
   * @param {string} reportId - Report ID
   * @returns {Promise<void>}
   */
  async deleteReport(userId, reportId) {
    const report = await reportRepository.findById(reportId);
    if (!report) {
      throw new AppError('Report not found', 404);
    }

    // Verify ownership
    if (report.userId !== userId) {
      throw new AppError('Report not found', 404);
    }

    await reportRepository.deleteReport(reportId);
  },

  /**
   * Private: Generate summary from evaluation data
   * 
   * @param {Object} evaluation - Evaluation object
   * @param {Object} interview - Interview object
   * @returns {string} Generated summary
   */
  _generateSummary(evaluation, interview) {
    return `Interview for ${interview.role} position completed with a score of ${evaluation.score}/100. 
    
Key Strengths:
${evaluation.strengths}

Areas for Improvement:
${evaluation.weaknesses}

Detailed Feedback:
${evaluation.feedback}`;
  },

  /**
   * Private: Generate recommendation based on score
   * 
   * @param {number} score - Overall score
   * @param {string} strengths - Evaluation strengths
   * @param {string} weaknesses - Evaluation weaknesses
   * @returns {string} Generated recommendation
   */
  _generateRecommendation(score, strengths, weaknesses) {
    let recommendation = '';

    if (score >= 90) {
      recommendation = 'Excellent Performance! You demonstrated exceptional skills and are well-prepared for this role. ';
    } else if (score >= 75) {
      recommendation = 'Strong Performance! You showed solid competency in most areas. ';
    } else if (score >= 60) {
      recommendation = 'Good Performance! You have a decent foundation, but there are areas that need improvement. ';
    } else if (score >= 40) {
      recommendation = 'Fair Performance. You need to work on several key areas before attempting similar roles. ';
    } else {
      recommendation = 'Needs Improvement. Significant preparation is required before you can be competitive for this role. ';
    }

    recommendation += '\n\nFocus on building upon your strengths while addressing the identified weaknesses to improve your interview performance.';

    return recommendation;
  },
};
