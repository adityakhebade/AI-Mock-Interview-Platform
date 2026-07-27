import { userRepository } from '../repositories/user.repository.js';
import AppError from '../utils/AppError.js';

/**
 * Authentication Service
 * 
 * Handles business logic for authentication operations.
 * Orchestrates user synchronization with Clerk.
 */

export const authService = {
  /**
   * Sync user from Clerk authentication
   * Creates user if first login, returns existing user otherwise
   * 
   * @param {Object} clerkUser - User data from Clerk token
   * @param {string} clerkUser.userId - Clerk user ID
   * @param {string} clerkUser.emailAddress - User email
   * @param {string} clerkUser.fullName - User full name
   * @param {string} [clerkUser.imageUrl] - User profile image
   * @returns {Promise<Object>} User profile
   */
  async syncUser(clerkUser) {
    // Validate required Clerk data
    if (!clerkUser.userId) {
      throw new AppError('Clerk user ID is required', 400);
    }

    if (!clerkUser.emailAddress) {
      throw new AppError('Email is required', 400);
    }

    // Prepare user data
    const userData = {
      clerkId: clerkUser.userId,
      email: clerkUser.emailAddress,
      name: clerkUser.fullName || clerkUser.emailAddress.split('@')[0],
      imageUrl: clerkUser.imageUrl || null,
    };

    // Upsert user (create if not exists, update if exists)
    const user = await userRepository.upsertUser(userData);

    // Return public user profile
    return this.formatUserProfile(user);
  },

  /**
   * Get current authenticated user
   * 
   * @param {string} userId - Internal user ID
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
   * Get user by Clerk ID
   * 
   * @param {string} clerkId - Clerk user ID
   * @returns {Promise<Object|null>} User profile or null
   */
  async getUserByClerkId(clerkId) {
    const user = await userRepository.findByClerkId(clerkId);

    if (!user) {
      return null;
    }

    return this.formatUserProfile(user);
  },

  /**
   * Update user profile
   * 
   * @param {string} userId - Internal user ID
   * @param {Object} updateData - Profile data to update
   * @returns {Promise<Object>} Updated user profile
   */
  async updateProfile(userId, updateData) {
    // Validate user exists
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Prepare update data (only allow certain fields)
    const allowedUpdates = {};
    if (updateData.name !== undefined) {
      allowedUpdates.name = updateData.name;
    }
    if (updateData.imageUrl !== undefined) {
      allowedUpdates.imageUrl = updateData.imageUrl;
    }

    // Update user
    const updatedUser = await userRepository.updateUser(userId, allowedUpdates);

    return this.formatUserProfile(updatedUser);
  },

  /**
   * Format user profile for API response (public data only)
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
