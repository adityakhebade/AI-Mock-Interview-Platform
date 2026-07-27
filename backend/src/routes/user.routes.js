import express from 'express';
import { getCurrentUser, updateProfile } from '../controllers/user.controller.js';
import { requireAuthentication } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateProfileSchema } from '../validations/user.validation.js';

const router = express.Router();

/**
 * User Routes
 * Base path: /api/v1/users
 * 
 * All routes require authentication
 */

// Apply authentication to all user routes
router.use(requireAuthentication);

/**
 * GET /api/v1/users/me
 * Get current authenticated user profile
 */
router.get('/me', getCurrentUser);

/**
 * PATCH /api/v1/users/me
 * Update current authenticated user profile
 */
router.patch('/me', validate(updateProfileSchema), updateProfile);

export default router;
