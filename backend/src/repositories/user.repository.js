import prisma from '../config/prisma.js';

/**
 * User Repository
 * 
 * Handles all database operations for User model.
 * Only this layer can access Prisma for User operations.
 */

export const userRepository = {
  /**
   * Find user by Clerk ID
   * @param {string} clerkId - Clerk user identifier
   * @returns {Promise<Object|null>} User object or null
   */
  async findByClerkId(clerkId) {
    return await prisma.user.findUnique({
      where: { clerkId },
    });
  },

  /**
   * Find user by internal ID
   * @param {string} id - Internal user ID
   * @returns {Promise<Object|null>} User object or null
   */
  async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User object or null
   */
  async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  /**
   * Create a new user
   * @param {Object} userData - User data from Clerk
   * @param {string} userData.clerkId - Clerk user ID
   * @param {string} userData.email - User email
   * @param {string} userData.name - User full name
   * @param {string} [userData.imageUrl] - User profile image URL
   * @returns {Promise<Object>} Created user object
   */
  async createUser(userData) {
    return await prisma.user.create({
      data: {
        clerkId: userData.clerkId,
        email: userData.email,
        name: userData.name,
        imageUrl: userData.imageUrl || null,
      },
    });
  },

  /**
   * Update user profile
   * @param {string} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user object
   */
  async updateUser(id, updateData) {
    return await prisma.user.update({
      where: { id },
      data: updateData,
    });
  },

  /**
   * Upsert user (create if not exists, return if exists)
   * @param {Object} userData - User data from Clerk
   * @returns {Promise<Object>} User object
   */
  async upsertUser(userData) {
    return await prisma.user.upsert({
      where: { clerkId: userData.clerkId },
      update: {
        email: userData.email,
        name: userData.name,
        imageUrl: userData.imageUrl || null,
      },
      create: {
        clerkId: userData.clerkId,
        email: userData.email,
        name: userData.name,
        imageUrl: userData.imageUrl || null,
      },
    });
  },
};
