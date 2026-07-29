import express from 'express';
import { dashboardController } from '../controllers/dashboard.controller.js';
import { requireAuthentication } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * Dashboard Routes
 * 
 * All routes require authentication.
 * Base path: /api/v1/dashboard
 */

// Apply authentication middleware to all routes
router.use(requireAuthentication);

/**
 * GET /api/v1/dashboard
 * Get complete dashboard overview (stats + analytics + recent activity)
 */
router.get('/', dashboardController.overview);

/**
 * GET /api/v1/dashboard/stats
 * Get dashboard statistics only
 */
router.get('/stats', dashboardController.stats);

/**
 * GET /api/v1/dashboard/analytics
 * Get dashboard analytics only
 */
router.get('/analytics', dashboardController.analytics);

/**
 * GET /api/v1/dashboard/recent
 * Get recent activity only
 */
router.get('/recent', dashboardController.recent);

export default router;
