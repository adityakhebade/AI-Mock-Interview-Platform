import prisma from '../config/prisma.js';
import type { ClerkUserProfile } from '../types/user.js';
import type { User } from '@prisma/client';

export const userRepository = {
  findByClerkId: async (clerkId: string): Promise<User | null> => {
    return prisma.user.findUnique({
      where: { clerkId },
    });
  },

  upsertFromClerkProfile: async (profile: ClerkUserProfile): Promise<User> => {
    return prisma.user.upsert({
      where: { clerkId: profile.clerkId },
      create: {
        clerkId: profile.clerkId,
        email: profile.email,
        displayName: profile.displayName,
        imageUrl: profile.imageUrl,
      },
      update: {
        email: profile.email,
        displayName: profile.displayName,
        imageUrl: profile.imageUrl,
      },
    });
  },

  findById: async (id: string): Promise<User | null> => {
    return prisma.user.findUnique({
      where: { id },
    });
  },
};
