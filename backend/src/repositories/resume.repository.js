import prisma from '../config/prisma.js';

/**
 * Resume Repository
 * 
 * Handles all database operations for Resume model.
 * Only this layer can access Prisma for Resume operations.
 */

export const resumeRepository = {
  /**
   * Create a new resume record
   * 
   * @param {Object} resumeData - Resume data
   * @param {string} resumeData.userId - User ID who owns the resume
   * @param {string} resumeData.fileName - Original file name
   * @param {string} resumeData.fileUrl - Cloudinary URL
   * @param {string} resumeData.publicId - Cloudinary public ID
   * @param {number} resumeData.fileSize - File size in bytes
   * @returns {Promise<Object>} Created resume object
   */
  async createResume(resumeData) {
    return await prisma.resume.create({
      data: resumeData,
    });
  },

  /**
   * Find resume by ID
   * 
   * @param {string} id - Resume ID
   * @returns {Promise<Object|null>} Resume object or null
   */
  async findById(id) {
    return await prisma.resume.findUnique({
      where: { id },
    });
  },

  /**
   * Find all resumes for a user
   * 
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of resume objects
   */
  async findByUserId(userId) {
    return await prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Find resume by ID and user ID (for ownership verification)
   * 
   * @param {string} id - Resume ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Resume object or null
   */
  async findByIdAndUserId(id, userId) {
    return await prisma.resume.findFirst({
      where: {
        id,
        userId,
      },
    });
  },

  /**
   * Update resume
   * 
   * @param {string} id - Resume ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated resume object
   */
  async updateResume(id, updateData) {
    return await prisma.resume.update({
      where: { id },
      data: updateData,
    });
  },

  /**
   * Delete resume
   * 
   * @param {string} id - Resume ID
   * @returns {Promise<Object>} Deleted resume object
   */
  async deleteResume(id) {
    return await prisma.resume.delete({
      where: { id },
    });
  },

  /**
   * Count user's resumes
   * 
   * @param {string} userId - User ID
   * @returns {Promise<number>} Count of resumes
   */
  async countByUserId(userId) {
    return await prisma.resume.count({
      where: { userId },
    });
  },
};
