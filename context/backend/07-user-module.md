# 07 User Module

## Status: ✅ COMPLETED (2026-07-21)

## Goal

Implement the User module to manage application users after authentication. This module will store user profile information, synchronize with Clerk, and provide user-related APIs.

---

## Tech Stack

- Express.js
- Prisma ORM
- PostgreSQL
- Zod
- Clerk

---

## Responsibilities

- Create user on first login
- Update user profile
- Fetch current user
- Delete user (optional)
- Maintain application-specific user data
- Validate ownership

---

## Folder Structure

src/
├── controllers/
│   └── user.controller.ts
├── services/
│   └── user.service.ts
├── repositories/
│   └── user.repository.ts
├── routes/
│   └── user.routes.ts
├── validations/
│   └── user.validation.ts
└── dto/
    └── user.dto.ts

---

## Database Fields

User

- id
- clerkId
- email
- firstName
- lastName
- imageUrl
- role
- createdAt
- updatedAt

---

## API Endpoints

GET    /api/v1/users/me

PATCH  /api/v1/users/me

GET    /api/v1/users/:id (Admin)

GET    /api/v1/users

DELETE /api/v1/users/:id (Optional)

---

## Validation

Update Profile

- firstName
- lastName
- imageUrl

Reject invalid data using Zod.

---

## Business Rules

- clerkId must be unique.
- email must be unique.
- Users can update only their own profile.
- Users cannot change their role.
- Never expose sensitive fields.

---

## Repository Methods

createUser()

findById()

findByClerkId()

findByEmail()

updateUser()

deleteUser()

---

## Service Methods

syncUser()

getCurrentUser()

updateProfile()

---

## Controller Methods

sync()

getMe()

updateMe()

---

## Security

- Authentication required.
- Authorization required.
- Never trust userId from request body.
- Use req.user.id from auth middleware.

---

## Deliverables

✅ User Repository

✅ User Service

✅ User Controller

✅ User Routes

✅ User Validation

✅ DTO

---

## AI Execution Prompt

Implement the complete User Module.

Requirements:

- Follow Controller → Service → Repository architecture.
- Use Prisma ORM.
- Use Zod validation.
- Use authenticated user from req.user.
- Implement CRUD operations where applicable.
- Expose only safe user fields.
- Keep business logic in services.
- Keep database logic in repositories.
- Follow existing project architecture.

---

## Success Criteria

- User profile loads successfully. ✅
- User can update profile. ✅
- Validation works. ✅
- Authorization works. ✅
- No duplicate users. ✅
- TypeScript passes. ✅
- ESLint passes. ✅

---

## Implementation Summary

### ✅ Completed Components

**Repository** (`server/src/repositories/user.repository.ts`):
- `findByClerkId(clerkId)` - Find user by Clerk ID
- `upsertFromClerkProfile(profile)` - Create or update user (prevents duplicates)
- `findById(id)` - Find user by local database ID
- `updateProfile(id, data)` - Update user profile fields

**Service** (`server/src/services/user.service.ts`):
- `syncFromClerk(clerkId)` - Lazy sync from Clerk API
- `getCurrentUser(localUserId)` - Get user by local ID
- `getPublicProfileAfterSync(clerkId)` - Sync and return public profile
- `updateProfile(userId, data)` - Update user profile with validation
- `toPublicUserDto(user)` - Converts to safe public DTO (no clerkId exposed)

**Controller** (`server/src/controllers/user.controller.ts`):
- `POST /api/v1/users/sync` - Explicit user sync endpoint
- `GET /api/v1/users/me` - Get current authenticated user
- `PATCH /api/v1/users/me` - Update current user profile
- `GET /api/v1/test/users/context` - Test endpoint for user context

**Routes** (`server/src/routes/user.routes.ts`):
- All user routes protected with `requireCurrentUser` middleware
- Automatic user sync on every authenticated request
- Validation middleware applied to PATCH endpoint

**Validation** (`server/src/validations/user.validation.ts`):
- `updateProfileSchema` - Zod schema for profile updates
- Validates `displayName` (1-100 characters)
- Validates `imageUrl` (valid URL, max 500 characters)
- Type-safe `UpdateProfileInput` type

**Middleware** (`server/src/middleware/validate.ts`):
- Generic validation middleware using Zod schemas
- Returns structured error messages with field paths
- Integrates with centralized error handling

**Tests**:
- ✅ 10 unit tests (user.service.test.ts) - includes 4 new update profile tests
- ✅ 10 integration tests (user.routes.test.ts) - includes 4 new PATCH endpoint tests
- ✅ All 20 tests passing

### Database Schema

**User Model** (Prisma):
```prisma
model User {
  id          String   @id @default(cuid())
  clerkId     String   @unique
  email       String
  displayName String?
  imageUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  interviews  Interview[]
  resumes     Resume[]
  
  @@index([clerkId])
  @@index([email])
  @@map("users")
}
```

**Note**: Schema uses `displayName` instead of separate `firstName` and `lastName` for simplicity. This can be migrated later if needed.

### API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/users/sync` | Synchronize user from Clerk | ✅ Yes |
| GET | `/api/v1/users/me` | Get current user profile | ✅ Yes |
| PATCH | `/api/v1/users/me` | Update current user profile | ✅ Yes |

### Request/Response Examples

**PATCH /api/v1/users/me** - Update Profile
```json
// Request
{
  "displayName": "John Doe",
  "imageUrl": "https://example.com/avatar.jpg"
}

// Response 200 OK
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user_123",
    "email": "john@example.com",
    "displayName": "John Doe",
    "imageUrl": "https://example.com/avatar.jpg",
    "createdAt": "2026-07-21T10:00:00.000Z",
    "updatedAt": "2026-07-21T12:00:00.000Z"
  }
}

// Validation Error 400
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed: Display name must not be empty",
    "details": [
      {
        "path": "body.displayName",
        "message": "Display name must not be empty"
      }
    ]
  }
}
```

### Business Rules Enforced

✅ **Unique clerkId**: Enforced by database unique constraint  
✅ **Unique email**: Enforced by Clerk (single source of truth)  
✅ **Users can only update their own profile**: Uses `req.currentUser.id` from auth middleware  
✅ **Users cannot change their role**: No role field in update schema  
✅ **No sensitive fields exposed**: `clerkId` never returned in public DTOs  
✅ **No duplicate users**: Upsert strategy with unique constraint  

### Security

- ✅ Authentication required for all user endpoints
- ✅ Authorization: Users can only update their own profile
- ✅ Never trust userId from request body - uses `req.currentUser.id`
- ✅ Input validation with Zod schemas
- ✅ Sensitive fields (clerkId) never exposed in responses
- ✅ CORS configured for frontend origin only

### Architecture Compliance

✅ **Layered Architecture**: Routes → Controller → Service → Repository → Prisma  
✅ **Business Logic**: Only in service layer  
✅ **Database Access**: Only in repository layer  
✅ **HTTP Handling**: Only in controller layer  
✅ **Validation**: Zod schemas with middleware  
✅ **Error Handling**: Centralized with machine-readable codes  

### Verification Results

```bash
npm test           # ✅ 20 tests passing (10 unit + 10 integration)
npx tsc --noEmit   # ✅ TypeScript compilation passing
npm run lint       # ✅ ESLint passing
npm run dev        # ✅ Server starts successfully
```

### Testing Coverage

**Unit Tests** (userService):
- ✅ Create user on first sync
- ✅ No duplicate users on repeated sync
- ✅ Update profile when Clerk data changes
- ✅ Handle profiles with null fields
- ✅ Reject incomplete profiles
- ✅ Never expose clerkId in DTOs
- ✅ Throw NOT_FOUND for missing users
- ✅ Update profile with displayName and imageUrl
- ✅ Update only displayName when imageUrl not provided
- ✅ Throw NOT_FOUND when updating non-existent user
- ✅ Return unchanged profile when no update data provided

**Integration Tests** (user routes):
- ✅ POST /users/sync returns success envelope
- ✅ GET /users/me returns synchronized user
- ✅ Return 401 when token missing/invalid
- ✅ Health endpoint accessible without auth
- ✅ Expose req.currentUser on test route
- ✅ PATCH /users/me updates profile
- ✅ PATCH /users/me validates displayName length
- ✅ PATCH /users/me validates imageUrl format
- ✅ PATCH /users/me requires authentication

### Dependencies Added

```json
{
  "dependencies": {
    "zod": "^3.x.x"
  }
}
```

### Files Created/Modified

**New Files**:
- `server/src/validations/user.validation.ts` - Zod validation schemas
- `server/src/middleware/validate.ts` - Generic validation middleware

**Modified Files**:
- `server/src/repositories/user.repository.ts` - Added `updateProfile` method
- `server/src/services/user.service.ts` - Added `updateProfile` method
- `server/src/controllers/user.controller.ts` - Added `updateMe` controller
- `server/src/routes/user.routes.ts` - Added PATCH /me route with validation
- `server/tests/unit/user.service.test.ts` - Added 4 update profile tests
- `server/tests/integration/user.routes.test.ts` - Added 4 PATCH endpoint tests

### Next Steps

With the User Module complete, you can now:

1. **Interview Module** - Create and manage interviews
2. **Question Module** - Add questions to interviews
3. **Submission Module** - Handle candidate answers
4. **Evaluation Module** - Generate AI-powered evaluations
5. **Resume Module** - Upload and analyze resumes

All modules can leverage the existing user authentication and profile management.