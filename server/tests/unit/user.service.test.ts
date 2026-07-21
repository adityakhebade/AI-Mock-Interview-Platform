import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { User } from '@prisma/client';

const mockFindByClerkId = jest.fn<() => Promise<User | null>>();
const mockUpsertFromClerkProfile = jest.fn<() => Promise<User>>();
const mockFindById = jest.fn<() => Promise<User | null>>();
const mockFetchClerkUserProfile = jest.fn();

jest.unstable_mockModule('../../src/repositories/user.repository.js', () => ({
  userRepository: {
    findByClerkId: mockFindByClerkId,
    upsertFromClerkProfile: mockUpsertFromClerkProfile,
    findById: mockFindById,
  },
}));

jest.unstable_mockModule('../../src/integrations/clerk/clerk.client.js', () => ({
  fetchClerkUserProfile: mockFetchClerkUserProfile,
}));

const { userService } = await import('../../src/services/user.service.js');
const { AppError } = await import('../../src/middleware/errorHandler.js');
const { ErrorCode } = await import('../../src/types/errors.js');

const baseUser: User = {
  id: 'user_internal_1',
  clerkId: 'clerk_user_1',
  email: 'candidate@example.com',
  displayName: 'Candidate Name',
  imageUrl: 'https://img.clerk.com/example',
  createdAt: new Date('2026-07-20T10:00:00.000Z'),
  updatedAt: new Date('2026-07-20T10:00:00.000Z'),
};

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a local user the first time a valid Clerk profile is synchronized', async () => {
    mockFetchClerkUserProfile.mockResolvedValue({
      clerkId: 'clerk_user_1',
      email: 'candidate@example.com',
      displayName: 'Candidate Name',
      imageUrl: 'https://img.clerk.com/example',
    });
    mockFindByClerkId.mockResolvedValue(null);
    mockUpsertFromClerkProfile.mockResolvedValue(baseUser);

    const result = await userService.syncFromClerk('clerk_user_1');

    expect(result).toEqual({
      id: 'user_internal_1',
      clerkId: 'clerk_user_1',
    });
    expect(mockUpsertFromClerkProfile).toHaveBeenCalledTimes(1);
  });

  it('returns the same local user on repeated sync without creating duplicates', async () => {
    mockFetchClerkUserProfile.mockResolvedValue({
      clerkId: 'clerk_user_1',
      email: 'candidate@example.com',
      displayName: 'Candidate Name',
      imageUrl: 'https://img.clerk.com/example',
    });
    mockFindByClerkId.mockResolvedValue(baseUser);

    const result = await userService.syncFromClerk('clerk_user_1');

    expect(result).toEqual({
      id: 'user_internal_1',
      clerkId: 'clerk_user_1',
    });
    expect(mockUpsertFromClerkProfile).not.toHaveBeenCalled();
  });

  it('updates profile fields when Clerk data changes', async () => {
    mockFetchClerkUserProfile.mockResolvedValue({
      clerkId: 'clerk_user_1',
      email: 'updated@example.com',
      displayName: 'Updated Name',
      imageUrl: 'https://img.clerk.com/updated',
    });
    mockFindByClerkId.mockResolvedValue(baseUser);
    mockUpsertFromClerkProfile.mockResolvedValue({
      ...baseUser,
      email: 'updated@example.com',
      displayName: 'Updated Name',
      imageUrl: 'https://img.clerk.com/updated',
    });

    await userService.syncFromClerk('clerk_user_1');

    expect(mockUpsertFromClerkProfile).toHaveBeenCalledTimes(1);
  });

  it('maps profile name, email, and image safely', async () => {
    mockFetchClerkUserProfile.mockResolvedValue({
      clerkId: 'clerk_user_2',
      email: 'minimal@example.com',
      displayName: null,
      imageUrl: null,
    });
    mockFindByClerkId.mockResolvedValue(null);
    mockUpsertFromClerkProfile.mockResolvedValue({
      ...baseUser,
      id: 'user_internal_2',
      clerkId: 'clerk_user_2',
      email: 'minimal@example.com',
      displayName: null,
      imageUrl: null,
    });
    mockFindById.mockResolvedValue({
      ...baseUser,
      id: 'user_internal_2',
      clerkId: 'clerk_user_2',
      email: 'minimal@example.com',
      displayName: null,
      imageUrl: null,
    });

    const profile = await userService.getPublicProfileAfterSync('clerk_user_2');

    expect(profile).toEqual({
      id: 'user_internal_2',
      email: 'minimal@example.com',
      displayName: null,
      imageUrl: null,
      createdAt: baseUser.createdAt.toISOString(),
      updatedAt: baseUser.updatedAt.toISOString(),
    });
    expect(profile).not.toHaveProperty('clerkId');
  });

  it('rejects a first-time profile without required email', async () => {
    mockFetchClerkUserProfile.mockResolvedValue({
      clerkId: 'clerk_user_3',
      email: '',
      displayName: 'No Email User',
      imageUrl: null,
    });
    mockFindByClerkId.mockResolvedValue(null);

    await expect(userService.syncFromClerk('clerk_user_3')).rejects.toMatchObject({
      statusCode: 422,
      code: ErrorCode.USER_PROFILE_INCOMPLETE,
    });
  });

  it('never passes raw Clerk provider details through the public user DTO', async () => {
    mockFindById.mockResolvedValue(baseUser);

    const profile = await userService.getCurrentUser('user_internal_1');

    expect(profile).toEqual({
      id: 'user_internal_1',
      email: 'candidate@example.com',
      displayName: 'Candidate Name',
      imageUrl: 'https://img.clerk.com/example',
      createdAt: baseUser.createdAt.toISOString(),
      updatedAt: baseUser.updatedAt.toISOString(),
    });
    expect(profile).not.toHaveProperty('clerkId');
  });

  it('throws NOT_FOUND when the local user record is missing', async () => {
    mockFindById.mockResolvedValue(null);

    await expect(userService.getCurrentUser('missing-user')).rejects.toBeInstanceOf(
      AppError
    );
  });
});
