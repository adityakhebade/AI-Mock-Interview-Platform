import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import type { User } from '@prisma/client';

type AuthState = {
  isAuthenticated: boolean;
  userId: string | null;
};

const mockGetAuth = jest.fn<() => AuthState>();
const mockFetchClerkUserProfile = jest.fn();
const mockFindByClerkId = jest.fn<() => Promise<User | null>>();
const mockUpsertFromClerkProfile = jest.fn<() => Promise<User>>();
const mockFindById = jest.fn<() => Promise<User | null>>();

jest.unstable_mockModule('@clerk/express', () => ({
  clerkMiddleware: () => (_req: unknown, _res: unknown, next: () => void) =>
    next(),
  getAuth: mockGetAuth,
  clerkClient: {
    users: {
      getUser: jest.fn(),
    },
  },
}));

jest.unstable_mockModule('../../src/integrations/clerk/clerk.client.js', () => ({
  fetchClerkUserProfile: mockFetchClerkUserProfile,
}));

jest.unstable_mockModule('../../src/repositories/user.repository.js', () => ({
  userRepository: {
    findByClerkId: mockFindByClerkId,
    upsertFromClerkProfile: mockUpsertFromClerkProfile,
    findById: mockFindById,
  },
}));

const { default: app } = await import('../../src/app.js');
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

const authenticateAs = (userId: string | null) => {
  mockGetAuth.mockReturnValue({
    isAuthenticated: Boolean(userId),
    userId,
  });
};

describe('user routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchClerkUserProfile.mockResolvedValue({
      clerkId: 'clerk_user_1',
      email: 'candidate@example.com',
      displayName: 'Candidate Name',
      imageUrl: 'https://img.clerk.com/example',
    });
    mockFindByClerkId.mockResolvedValue(null);
    mockUpsertFromClerkProfile.mockResolvedValue(baseUser);
    mockFindById.mockResolvedValue(baseUser);
  });

  it('POST /users/sync returns 200 and the standard success envelope', async () => {
    authenticateAs('clerk_user_1');

    const response = await request(app)
      .post('/api/v1/users/sync')
      .set('Authorization', 'Bearer test-token')
      .expect(200);

    expect(response.body).toEqual({
      success: true,
      data: {
        id: 'user_internal_1',
        email: 'candidate@example.com',
        displayName: 'Candidate Name',
        imageUrl: 'https://img.clerk.com/example',
        createdAt: baseUser.createdAt.toISOString(),
        updatedAt: baseUser.updatedAt.toISOString(),
      },
    });
    expect(response.body.data).not.toHaveProperty('clerkId');
  });

  it('GET /users/me returns the synchronized user', async () => {
    authenticateAs('clerk_user_1');
    mockFindByClerkId.mockResolvedValue(baseUser);

    const response = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', 'Bearer test-token')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe('candidate@example.com');
  });

  it('returns standard 401 envelope when token is missing or invalid', async () => {
    authenticateAs(null);

    const response = await request(app)
      .get('/api/v1/users/me')
      .expect(401);

    expect(response.body).toEqual({
      success: false,
      error: {
        code: ErrorCode.UNAUTHENTICATED,
        message: 'Authentication required',
      },
    });
  });

  it('keeps the health endpoint accessible without authentication', async () => {
    authenticateAs(null);

    const response = await request(app).get('/api/v1/health').expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('healthy');
  });

  it('exposes req.currentUser with internal ID and Clerk ID only on protected test route', async () => {
    authenticateAs('clerk_user_1');
    mockFindByClerkId.mockResolvedValue(baseUser);

    const response = await request(app)
      .get('/api/v1/test/users/context')
      .set('Authorization', 'Bearer test-token')
      .expect(200);

    expect(response.body).toEqual({
      success: true,
      data: {
        id: 'user_internal_1',
        clerkId: 'clerk_user_1',
      },
    });
  });
});
