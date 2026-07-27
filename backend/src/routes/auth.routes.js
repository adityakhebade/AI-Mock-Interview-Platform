import express from 'express';
import { syncUser, getCurrentUser, updateProfile } from '../controllers/auth.controller.js';
import { requireAuthentication } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateProfileSchema } from '../validations/auth.validation.js';

const router = express.Router();

/**
 * Authentication Routes
 * Base path: /api/v1/auth
 */

// POST /api/v1/auth/sync - Sync user from Clerk
router.post('/sync', requireAuthentication, syncUser);

// GET /api/v1/auth/me - Get current user profile
router.get('/me', requireAuthentication, getCurrentUser);

// PATCH /api/v1/auth/profile - Update user profile
router.patch('/profile', requireAuthentication, validate(updateProfileSchema), updateProfile);

export default router;
