import express from 'express';
import {
  uploadResume,
  listResumes,
  getResume,
  replaceResume,
  deleteResume,
} from '../controllers/resume.controller.js';
import { requireAuthentication } from '../middleware/auth.middleware.js';
import { uploadSingleFile, handleUploadError } from '../middleware/upload.middleware.js';

const router = express.Router();

/**
 * Resume Routes
 * Base path: /api/v1/resumes
 * 
 * All routes require authentication
 */

// Apply authentication to all resume routes
router.use(requireAuthentication);

/**
 * POST /api/v1/resumes
 * Upload a new resume
 * 
 * Content-Type: multipart/form-data
 * Field name: 'file'
 * Allowed types: PDF, DOC, DOCX
 * Max size: 5 MB
 */
router.post('/', uploadSingleFile, handleUploadError, uploadResume);

/**
 * GET /api/v1/resumes
 * List all resumes for authenticated user
 */
router.get('/', listResumes);

/**
 * GET /api/v1/resumes/:id
 * Get a specific resume by ID
 */
router.get('/:id', getResume);

/**
 * PATCH /api/v1/resumes/:id
 * Replace an existing resume
 * 
 * Content-Type: multipart/form-data
 * Field name: 'file'
 * Allowed types: PDF, DOC, DOCX
 * Max size: 5 MB
 */
router.patch('/:id', uploadSingleFile, handleUploadError, replaceResume);

/**
 * DELETE /api/v1/resumes/:id
 * Delete a resume
 */
router.delete('/:id', deleteResume);

export default router;
