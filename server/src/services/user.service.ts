import { AppError } from '../middleware/errorHandler.js';
import { fetchClerkUserProfile } from '../integrations/clerk/clerk.client.js';
import { userRepository } from '../repositories/user.repository.js';
import { ErrorCode } from '../types/errors.js';
import type { CurrentUser, PublicUserDto } from '../types/user.js';
import type { User } from '@prisma/client';

const toPublicUserDto = (user: User): PublicUserDto => ({
  id: user.id,
  email: user.email,
  displayName: user.displayName,
  imageUrl: user.imageUrl,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});

const toCurrentUser = (user: User): CurrentUser => ({
  id: user.id,
  clerkId: user.clerkId,
});

const hasProfileChanges = (
  existing: User,
  profile: {
    email: string;
    displayName: string | null;
    imageUrl: string | null;
  }
): boolean => {
  return (
    existing.email !== profile.email ||
    existing.displayName !== profile.displayName ||
    existing.imageUrl !== profile.imageUrl
  );
};

export const userService = {
  syncFromClerk: async (clerkId: string): Promise<CurrentUser> => {
    const profile = await fetchClerkUserProfile(clerkId);

    if (!profile.email) {
      const existing = await userRepository.findByClerkId(clerkId);

      if (!existing) {
        throw new AppError(
          'Clerk profile is missing a required primary email',
          422,
          ErrorCode.USER_PROFILE_INCOMPLETE
        );
      }

      return toCurrentUser(existing);
    }

    const existing = await userRepository.findByClerkId(clerkId);

    if (
      existing &&
      !hasProfileChanges(existing, {
        email: profile.email,
        displayName: profile.displayName,
        imageUrl: profile.imageUrl,
      })
    ) {
      return toCurrentUser(existing);
    }

    const user = await userRepository.upsertFromClerkProfile(profile);
    return toCurrentUser(user);
  },

  getCurrentUser: async (localUserId: string): Promise<PublicUserDto> => {
    const user = await userRepository.findById(localUserId);

    if (!user) {
      throw new AppError('User not found', 404, ErrorCode.NOT_FOUND);
    }

    return toPublicUserDto(user);
  },

  getPublicProfileAfterSync: async (
    clerkId: string
  ): Promise<PublicUserDto> => {
    const currentUser = await userService.syncFromClerk(clerkId);
    return userService.getCurrentUser(currentUser.id);
  },

  updateProfile: async (
    userId: string,
    data: { displayName?: string; imageUrl?: string }
  ): Promise<PublicUserDto> => {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404, ErrorCode.NOT_FOUND);
    }

    // Filter out undefined values
    const updateData: { displayName?: string; imageUrl?: string } = {};
    if (data.displayName !== undefined)
      updateData.displayName = data.displayName;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;

    // Only update if there's data to update
    if (Object.keys(updateData).length === 0) {
      return toPublicUserDto(user);
    }

    const updatedUser = await userRepository.updateProfile(userId, updateData);
    return toPublicUserDto(updatedUser);
  },
};

export { toPublicUserDto };
