import { asyncHandler } from '../utils/asyncHandler.js';
import { userService } from '../services/user.service.js';
import { sendSuccess } from '../utils/response.js';

/**
 * User Controller
 * 
 * Handles HTTP requests for user profile endpoints.
 * Only responsible for request/response handling.
 */

/**
 * GET /api/v1/users/me
 * Get current authenticated user profile
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  // Get user ID from authenticated user (set by auth middleware)
  const userId = req.user.id;

  const user = await userService.getCurrentUser(userId);

  sendSuccess(res, user, 'User profile retrieved successfully');
});

/**
 * PATCH /api/v1/users/me
 * Update current authenticated user profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
  // Get user ID from authenticated user (set by auth middleware)
  const userId = req.user.id;

  // Extract allowed update fields from request body
  const { name, imageUrl } = req.body;

  const updatedUser = await userService.updateProfile(userId, {
    name,
    imageUrl,
  });

  sendSuccess(res, updatedUser, 'Profile updated successfully');
});
