import { asyncHandler } from '../utils/asyncHandler.js';
import { resumeService } from '../services/resume.service.js';
import { sendSuccess } from '../utils/response.js';
import AppError from '../utils/AppError.js';

/**
 * Resume Controller
 * 
 * Handles HTTP requests for resume endpoints.
 * Only responsible for request/response handling.
 */

/**
 * POST /api/v1/resumes
 * Upload a new resume
 */
export const uploadResume = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const file = req.file;

  if (!file) {
    throw new AppError('Please upload a file', 400);
  }

  const resume = await resumeService.uploadResume(userId, file);

  sendSuccess(res, resume, 'Resume uploaded successfully', 201);
});

/**
 * GET /api/v1/resumes
 * List all resumes for authenticated user
 */
export const listResumes = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const resumes = await resumeService.listResumes(userId);

  sendSuccess(res, { resumes }, 'Resumes retrieved successfully');
});

/**
 * GET /api/v1/resumes/:id
 * Get a specific resume
 */
export const getResume = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const resume = await resumeService.getResume(id, userId);

  sendSuccess(res, resume, 'Resume retrieved successfully');
});

/**
 * PATCH /api/v1/resumes/:id
 * Replace an existing resume
 */
export const replaceResume = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const file = req.file;

  if (!file) {
    throw new AppError('Please upload a file', 400);
  }

  const resume = await resumeService.replaceResume(id, userId, file);

  sendSuccess(res, resume, 'Resume replaced successfully');
});

/**
 * DELETE /api/v1/resumes/:id
 * Delete a resume
 */
export const deleteResume = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const result = await resumeService.deleteResume(id, userId);

  sendSuccess(res, result, 'Resume deleted successfully');
});
