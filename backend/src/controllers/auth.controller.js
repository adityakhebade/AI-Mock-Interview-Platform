import { asyncHandler } from '../utils/asyncHandler.js';
import { authService } from '../services/auth.service.js';
import { sendSuccess } from '../utils/response.js';

/**
 * Authentication Controller
 * 
 * Handles HTTP requests for authentication endpoints.
 * Only responsible for request/response handling.
 */

/**
 * POST /api/v1/auth/sync
 * Sync user from Clerk (create if first login)
 */
export const syncUser = asyncHandler(async (req, res) => {
  // User is already synced by requireAuthentication middleware
  // Just return the user from req.user
  sendSuccess(res, req.user, 'User synchronized successfully');
});

/**
 * GET /api/v1/auth/me
 * Get current authenticated user profile
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  // User is already attached by requireAuthentication middleware
  sendSuccess(res, req.user, 'User profile retrieved successfully');
});

/**
 * PATCH /api/v1/auth/profile
 * Update user profile (optional endpoint)
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, imageUrl } = req.body;

  const updatedUser = await authService.updateProfile(req.user.id, {
    name,
    imageUrl,
  });

  sendSuccess(res, updatedUser, 'Profile updated successfully');
});
