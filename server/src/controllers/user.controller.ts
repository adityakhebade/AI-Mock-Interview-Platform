import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { userService } from '../services/user.service.js';

export const syncUser = asyncHandler(async (req: Request, res: Response) => {
  const profile = await userService.getPublicProfileAfterSync(
    req.currentUser!.clerkId
  );

  res.status(200).json({
    success: true,
    data: profile,
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const profile = await userService.getPublicProfileAfterSync(
    req.currentUser!.clerkId
  );

  res.status(200).json({
    success: true,
    data: profile,
  });
});

export const getCurrentUserContext = asyncHandler(
  async (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: req.currentUser,
    });
  }
);
