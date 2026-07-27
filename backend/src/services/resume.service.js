import { resumeRepository } from '../repositories/resume.repository.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import AppError from '../utils/AppError.js';

/**
 * Resume Service
 * 
 * Handles business logic for resume management.
 * Coordinates file uploads to Cloudinary and metadata storage in database.
 */

export const resumeService = {
  /**
   * Upload a new resume
   * 
   * @param {string} userId - User ID from authenticated user
   * @param {Object} file - Multer file object
   * @param {Buffer} file.buffer - File buffer
   * @param {string} file.originalname - Original file name
   * @param {string} file.mimetype - MIME type
   * @param {number} file.size - File size in bytes
   * @returns {Promise<Object>} Created resume object
   */
  async uploadResume(userId, file) {
    if (!file) {
      throw new AppError('No file provided', 400);
    }

    try {
      // Upload file to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(file.buffer, 'intervuex/resumes');

      // Prepare resume data
      const resumeData = {
        userId,
        fileName: file.originalname,
        fileUrl: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        fileSize: file.size,
      };

      // Save metadata to database
      const resume = await resumeRepository.createResume(resumeData);

      return this.formatResumeResponse(resume);
    } catch (error) {
      console.error('Resume upload error:', error);
      throw new AppError('Failed to upload resume', 500);
    }
  },

  /**
   * Get a specific resume by ID
   * 
   * @param {string} resumeId - Resume ID
   * @param {string} userId - User ID for ownership verification
   * @returns {Promise<Object>} Resume object
   */
  async getResume(resumeId, userId) {
    const resume = await resumeRepository.findByIdAndUserId(resumeId, userId);

    if (!resume) {
      throw new AppError('Resume not found or access denied', 404);
    }

    return this.formatResumeResponse(resume);
  },

  /**
   * List all resumes for a user
   * 
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of resume objects
   */
  async listResumes(userId) {
    const resumes = await resumeRepository.findByUserId(userId);
    return resumes.map((resume) => this.formatResumeResponse(resume));
  },

  /**
   * Replace an existing resume
   * Uploads new file and deletes old one from Cloudinary
   * 
   * @param {string} resumeId - Resume ID to replace
   * @param {string} userId - User ID for ownership verification
   * @param {Object} file - New file from multer
   * @returns {Promise<Object>} Updated resume object
   */
  async replaceResume(resumeId, userId, file) {
    if (!file) {
      throw new AppError('No file provided', 400);
    }

    // Verify ownership
    const existingResume = await resumeRepository.findByIdAndUserId(resumeId, userId);

    if (!existingResume) {
      throw new AppError('Resume not found or access denied', 404);
    }

    try {
      // Upload new file to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(file.buffer, 'intervuex/resumes');

      // Update resume metadata
      const updateData = {
        fileName: file.originalname,
        fileUrl: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        fileSize: file.size,
      };

      const updatedResume = await resumeRepository.updateResume(resumeId, updateData);

      // Delete old file from Cloudinary
      try {
        await deleteFromCloudinary(existingResume.publicId);
      } catch (deleteError) {
        console.error('Failed to delete old file from Cloudinary:', deleteError);
        // Don't fail the request if Cloudinary deletion fails
      }

      return this.formatResumeResponse(updatedResume);
    } catch (error) {
      console.error('Resume replace error:', error);
      throw new AppError('Failed to replace resume', 500);
    }
  },

  /**
   * Delete a resume
   * Removes file from Cloudinary and metadata from database
   * 
   * @param {string} resumeId - Resume ID
   * @param {string} userId - User ID for ownership verification
   * @returns {Promise<Object>} Success message
   */
  async deleteResume(resumeId, userId) {
    // Verify ownership
    const resume = await resumeRepository.findByIdAndUserId(resumeId, userId);

    if (!resume) {
      throw new AppError('Resume not found or access denied', 404);
    }

    try {
      // Delete from Cloudinary
      await deleteFromCloudinary(resume.publicId);
    } catch (cloudinaryError) {
      console.error('Failed to delete file from Cloudinary:', cloudinaryError);
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from database
    await resumeRepository.deleteResume(resumeId);

    return {
      message: 'Resume deleted successfully',
    };
  },

  /**
   * Format resume for API response
   * 
   * @param {Object} resume - Resume object from database
   * @returns {Object} Formatted resume object
   */
  formatResumeResponse(resume) {
    return {
      id: resume.id,
      userId: resume.userId,
      fileName: resume.fileName,
      fileUrl: resume.fileUrl,
      publicId: resume.publicId,
      fileSize: resume.fileSize,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    };
  },
};
