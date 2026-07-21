import { clerkMiddleware, getAuth } from '@clerk/express';
import { Request, Response, NextFunction } from 'express';
import config from '../config/index.js';
import { AppError } from './errorHandler.js';
import { userService } from '../services/user.service.js';
import { ErrorCode } from '../types/errors.js';

const clerkOptions = {
  authorizedParties: config.clerk.authorizedParties,
  ...(config.clerk.jwtKey ? { jwtKey: config.clerk.jwtKey } : {}),
};

export const clerkAuthMiddleware = clerkMiddleware(clerkOptions);

export const requireCurrentUser = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const auth = getAuth(req, { acceptsToken: 'session_token' });

    if (!auth.isAuthenticated || !auth.userId) {
      throw new AppError(
        'Authentication required',
        401,
        ErrorCode.UNAUTHENTICATED
      );
    }

    const currentUser = await userService.syncFromClerk(auth.userId);
    req.currentUser = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

export const attachCurrentUserContext = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.currentUser) {
    next(
      new AppError(
        'Authenticated user context is missing',
        401,
        ErrorCode.UNAUTHENTICATED
      )
    );
    return;
  }

  next();
};
