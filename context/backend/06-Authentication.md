# 06 Authentication

## Status: ✅ COMPLETED (2026-07-21)

## Goal

Implement secure authentication using Clerk and synchronize authenticated users with PostgreSQL.

---

## Tech Stack

- Clerk Authentication
- Express.js
- Prisma ORM
- PostgreSQL
- Zod Validation

---

## Responsibilities

- Verify Clerk session
- Sync user to database
- Protect private routes
- Attach authenticated user to request
- Allow users to access only their own resources

---

## Folder Structure

src/
├── middleware/
│   └── auth.middleware.ts
├── controllers/
│   └── auth.controller.ts
├── services/
│   └── auth.service.ts
├── repositories/
│   └── user.repository.ts
├── routes/
│   └── auth.routes.ts
└── validations/
    └── auth.validation.ts

---

## Authentication Flow

Frontend
→ Clerk Login
→ JWT/Session
→ Auth Middleware
→ Verify Token
→ Sync User
→ Protected Route

---

## User Synchronization

If clerkId exists:
- Update user

Else:
- Create new user

Never create duplicate users.

---

## API Endpoints

POST /api/v1/auth/sync

GET /api/v1/auth/me

---

## Middleware Order

Helmet
→ CORS
→ Logger
→ Authentication
→ Validation
→ Routes
→ Error Handler

---

## Authorization Rules

- User can access only their own resumes.
- User can access only their own interviews.
- User can access only their own reports.
- Never trust userId from the client.

---

## Error Cases

- Missing token → 401
- Invalid token → 401
- User not found → 404
- Forbidden access → 403

---

## Deliverables

- Authentication middleware
- User synchronization
- Protected routes
- Current user endpoint
- Authorization checks

---

## AI Execution Prompt

Implement Clerk authentication for the Express backend.

Requirements:
- Verify Clerk JWT/session.
- Synchronize Clerk users with PostgreSQL using Prisma.
- Create auth middleware.
- Create auth controller, service, repository, and routes.
- Add /auth/sync and /auth/me endpoints.
- Protect private routes.
- Follow layered architecture.
- Use TypeScript, Prisma, Zod, and Express best practices.
- Do not implement other modules.

---

## Success Criteria

- Clerk login works. ✅
- User is created/updated in PostgreSQL. ✅
- Protected routes require authentication. ✅
- `/auth/me` returns the authenticated user. ✅ (Implemented as `/api/v1/users/me`)
- No duplicate users are created. ✅
- ESLint and TypeScript pass. ✅

---

## Implementation Summary

### ✅ Completed Components

**Middleware** (`server/src/middleware/clerk.middleware.ts`):
- `clerkAuthMiddleware` - Global Clerk middleware with authorized parties
- `requireCurrentUser` - Verifies token and syncs user from Clerk
- `attachCurrentUserContext` - Ensures authenticated context exists

**Controller** (`server/src/controllers/user.controller.ts`):
- `POST /api/v1/users/sync` - Explicit user sync endpoint
- `GET /api/v1/users/me` - Get current authenticated user
- `GET /api/v1/test/users/context` - Test endpoint for user context

**Service** (`server/src/services/user.service.ts`):
- `syncFromClerk(clerkId)` - Lazy sync from Clerk API
- `getCurrentUser(localUserId)` - Get user by local ID
- `getPublicProfileAfterSync(clerkId)` - Sync and return public profile
- `toPublicUserDto(user)` - Converts to safe public DTO (no clerkId exposed)

**Repository** (`server/src/repositories/user.repository.ts`):
- `findByClerkId(clerkId)` - Find user by Clerk ID
- `upsertFromClerkProfile(profile)` - Create or update user (prevents duplicates)
- `findById(id)` - Find user by local database ID

**Routes** (`server/src/routes/user.routes.ts`):
- All user routes protected with `requireCurrentUser` middleware
- Automatic user sync on every authenticated request

**Types** (`server/src/types/user.ts`, `server/src/types/errors.ts`):
- `ClerkUserProfile` - Clerk API profile shape
- `CurrentUser` - Minimal authenticated context (id, clerkId)
- `PublicUserDto` - Safe public user data (no clerkId)
- `ErrorCode` enum with `UNAUTHENTICATED`, `USER_PROFILE_INCOMPLETE`, `NOT_FOUND`

**Integration** (`server/src/integrations/clerk/clerk.client.ts`):
- `fetchClerkUserProfile(clerkId)` - Fetches user from Clerk API
- Error handling for network and profile issues

**Tests**:
- ✅ 6 unit tests (user.service.test.ts)
- ✅ 6 integration tests (user.routes.test.ts)
- ✅ All 12 tests passing

**Configuration**:
- Environment variables validated on startup
- `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `CLERK_AUTHORIZED_PARTIES`
- Optional `CLERK_JWT_KEY` for networkless verification

### Architecture Compliance

✅ **Layered Architecture Followed**:
```
Routes → Controller → Service → Repository → Prisma → PostgreSQL
```

✅ **Business Logic Location**: Only in service layer  
✅ **Database Access**: Only in repository layer  
✅ **HTTP Handling**: Only in controller layer  
✅ **Validation**: Zod schemas ready (not needed for current endpoints)  
✅ **Error Handling**: Centralized with machine-readable codes  

### Authorization Implementation

**Current User Context**:
- Attached to `req.currentUser` by `requireCurrentUser` middleware
- Contains minimal data: `{ id, clerkId }`
- Used for ownership checks in business logic

**Ownership Rules** (Ready for implementation in other modules):
- User can only access their own interviews
- User can only access their own submissions
- User can only access their own resumes
- User can only access their own evaluations

**Example Usage in Future Controllers**:
```typescript
// In interview service
async getInterviewById(interviewId: string, userId: string) {
  const interview = await interviewRepository.findById(interviewId);
  
  if (interview.userId !== userId) {
    throw new AppError('Forbidden', 403, ErrorCode.FORBIDDEN);
  }
  
  return interview;
}
```

### Verification Results

```bash
npm test           # ✅ 12 tests passing
npx tsc --noEmit   # ✅ TypeScript compilation passing
npm run lint       # ✅ ESLint passing
npm run dev        # ✅ Server starts successfully
```

### API Testing

**Health Check** (Public):
```bash
GET http://localhost:5000/api/v1/health
# Response: 200 OK
```

**User Sync** (Protected):
```bash
POST http://localhost:5000/api/v1/users/sync
Authorization: Bearer <clerk_session_token>
# Response: 200 OK with user profile
```

**Get Current User** (Protected):
```bash
GET http://localhost:5000/api/v1/users/me
Authorization: Bearer <clerk_session_token>
# Response: 200 OK with user profile
```

### Database Integration

**User Table** (Prisma Schema):
```prisma
model User {
  id          String   @id @default(uuid())
  clerkId     String   @unique
  email       String
  displayName String?
  imageUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  interviews  Interview[]
  resumes     Resume[]
}
```

**Upsert Strategy**:
- Prevents duplicate users with `@unique` constraint on `clerkId`
- Updates existing users if profile changes
- Creates new users on first authentication

### Next Steps

With authentication complete, you can now implement:

1. **Interview Module** - CRUD operations for interviews
2. **Question Module** - Manage interview questions
3. **Submission Module** - Handle candidate answers
4. **Evaluation Module** - Generate performance reports
5. **Resume Module** - Upload and manage resumes

All modules can use `req.currentUser` for ownership validation.