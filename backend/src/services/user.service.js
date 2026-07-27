import { userRepository } from '../repositories/user.repository.js';
import AppError from '../utils/AppError.js';

/**
 * User Service
 * 
 * Handles business logic for user profile management.
 */

export const userService = {
  /**
   * Get current authenticated user profile
   * 
   * @param {string} userId - Internal user ID from req.user
   * @returns {Promise<Object>} User profile
   */
  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return this.formatUserProfile(user);
  },

  /**
   * Update user profile
   * 
   * @param {string} userId - Internal user ID from req.user
   * @param {Object} updateData - Profile data to update
   * @param {string} [updateData.name] - User's full name
   * @param {string} [updateData.imageUrl] - User's profile image URL
   * @returns {Promise<Object>} Updated user profile
   */
  async updateProfile(userId, updateData) {
    // Validate user exists
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Prepare update data (only allow specific fields)
    const allowedUpdates = {};
    
    if (updateData.name !== undefined) {
      allowedUpdates.name = updateData.name.trim();
    }
    
    if (updateData.imageUrl !== undefined) {
      allowedUpdates.imageUrl = updateData.imageUrl;
    }

    // Check if there are any updates to apply
    if (Object.keys(allowedUpdates).length === 0) {
      throw new AppError('No valid fields to update', 400);
    }

    // Update user in database
    const updatedUser = await userRepository.updateUser(userId, allowedUpdates);

    return this.formatUserProfile(updatedUser);
  },

  /**
   * Format user profile for API response
   * Only includes public/safe fields
   * 
   * @param {Object} user - User object from database
   * @returns {Object} Formatted user profile
   */
  formatUserProfile(user) {
    return {
      id: user.id,
      clerkId: user.clerkId,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },
};
