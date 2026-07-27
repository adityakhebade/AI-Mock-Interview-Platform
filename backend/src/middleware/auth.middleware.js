import { createClerkClient, clerkMiddleware, getAuth } from '@clerk/express';
import config from '../config/env.js';
import { authService } from '../services/auth.service.js';
import AppError from '../utils/AppError.js';

/**
 * Clerk Authentication Middleware
 * 
 * Verifies Clerk JWT tokens and attaches authenticated user to request.
 */

// Initialize Clerk client
const clerk = createClerkClient({
  secretKey: config.clerk.secretKey,
});

/**
 * Initialize Clerk middleware
 * This should be applied globally to all routes
 */
export const initClerkMiddleware = clerkMiddleware();

/**
 * Require authentication middleware
 * Ensures the request has a valid Clerk session
 * Syncs user with database and attaches to req.user
 */
export const requireAuthentication = async (req, res, next) => {
  try {
    // Get Clerk auth from request
    const auth = getAuth(req);
    const { userId, sessionId } = auth;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    // Get Clerk user details
    const clerkUser = await clerk.users.getUser(userId);

    if (!clerkUser) {
      throw new AppError('Clerk user not found', 401);
    }

    // Prepare user data for sync
    const userData = {
      userId: clerkUser.id,
      emailAddress: clerkUser.emailAddresses[0]?.emailAddress,
      fullName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
      imageUrl: clerkUser.imageUrl,
    };

    // Sync user with database (create if first login)
    const user = await authService.syncUser(userData);

    // Attach user to request
    req.user = user;
    req.clerkUserId = userId;
    req.sessionId = sessionId;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    // Handle Clerk-specific errors
    if (error.message?.includes('Unauthenticated') || error.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token',
      });
    }

    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

/**
 * Optional authentication middleware
 * Attaches user if authenticated, but doesn't require it
 */
export const optionalAuthentication = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    const { userId } = auth;

    if (!userId) {
      return next();
    }

    // Get Clerk user details
    const clerkUser = await clerk.users.getUser(userId);

    if (clerkUser) {
      const userData = {
        userId: clerkUser.id,
        emailAddress: clerkUser.emailAddresses[0]?.emailAddress,
        fullName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
        imageUrl: clerkUser.imageUrl,
      };

      const user = await authService.syncUser(userData);
      req.user = user;
    }

    next();
  } catch (error) {
    // For optional auth, just continue without user
    next();
  }
};
