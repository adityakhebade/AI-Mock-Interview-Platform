# Authentication Module Documentation

## Overview

IntervueX uses **Clerk** for authentication. The frontend authenticates users with Clerk, and the backend verifies Clerk JWT tokens, synchronizes users with PostgreSQL, and protects API routes.

**Status**: ✅ Implemented and Working

---

## Architecture

### Authentication Flow

```
User → Clerk Sign In (Frontend)
         ↓
    Clerk Session Token
         ↓
    API Request with Bearer Token
         ↓
    Clerk Middleware (Verify Token)
         ↓
    requireAuthentication Middleware
         ↓
    Sync User with Database
         ↓
    Attach req.user
         ↓
    Protected Route Handler
```

---

## Implementation

### 1. Clerk Configuration

**Environment Variables** (`.env`):
```env
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**Config** (`src/config/env.js`):
```javascript
clerk: {
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
}
```

---

### 2. Middleware

#### Global Clerk Middleware

**File**: `src/middleware/auth.middleware.js`

**Purpose**: Initialize Clerk SDK for all routes

```javascript
export const initClerkMiddleware = clerkMiddleware();
```

**Usage in** `src/app.js`:
```javascript
app.use(initClerkMiddleware);
```

#### Require Authentication Middleware

**Purpose**: Verify user is authenticated and sync with database

```javascript
export const requireAuthentication = async (req, res, next)
```

**Responsibilities**:
1. Extract `userId` from Clerk token using `getAuth(req)`
2. Verify user is authenticated (401 if not)
3. Fetch full user data from Clerk API
4. Sync user with PostgreSQL (create if first login)
5. Attach user object to `req.user`
6. Continue to route handler

**Usage**:
```javascript
router.get('/protected', requireAuthentication, handler);
```

---

### 3. Repository Layer

**File**: `src/repositories/user.repository.js`

**Methods**:

```javascript
// Find user by Clerk ID
await userRepository.findByClerkId(clerkId);

// Find user by internal ID
await userRepository.findById(id);

// Find user by email
await userRepository.findByEmail(email);

// Create new user
await userRepository.createUser(userData);

// Update user
await userRepository.updateUser(id, updateData);

// Upsert user (create or update)
await userRepository.upsertUser(userData);
```

**Database Access**: Only this layer accesses Prisma for User operations

---

### 4. Service Layer

**File**: `src/services/auth.service.js`

**Methods**:

#### syncUser(clerkUser)
- Creates user if first login
- Updates user if already exists
- Returns formatted user profile

#### getCurrentUser(userId)
- Fetches user by internal ID
- Returns formatted profile
- Throws 404 if not found

#### getUserByClerkId(clerkId)
- Fetches user by Clerk ID
- Returns profile or null

#### updateProfile(userId, updateData)
- Updates user name and imageUrl
- Returns updated profile

#### formatUserProfile(user)
- Formats user object for API response
- Only includes public fields

---

### 5. Controller Layer

**File**: `src/controllers/auth.controller.js`

**Handlers**:

#### syncUser
- POST /api/v1/auth/sync
- Returns user from req.user (already synced by middleware)

#### getCurrentUser
- GET /api/v1/auth/me
- Returns user from req.user

#### updateProfile
- PATCH /api/v1/auth/profile
- Updates user name/imageUrl
- Returns updated profile

---

### 6. Routes

**File**: `src/routes/auth.routes.js`

**Base Path**: `/api/v1/auth`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/sync` | ✅ | Sync user from Clerk |
| GET | `/me` | ✅ | Get current user profile |
| PATCH | `/profile` | ✅ | Update user profile |

**Registration in** `src/routes/api.routes.js`:
```javascript
router.use('/auth', authRoutes);
```

---

## API Endpoints

### POST /api/v1/auth/sync

**Purpose**: Create user if first login, return existing user otherwise

**Authentication**: Required (Clerk token)

**Request Headers**:
```
Authorization: Bearer <clerk_session_token>
```

**Request Body**: None

**Response** (200):
```json
{
  "success": true,
  "message": "User synchronized successfully",
  "data": {
    "id": "clxxx123",
    "clerkId": "user_2abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "imageUrl": "https://img.clerk.com/...",
    "createdAt": "2026-07-25T10:00:00Z",
    "updatedAt": "2026-07-25T10:00:00Z"
  }
}
```

**Errors**:
- 401: Missing or invalid token
- 500: Server error

---

### GET /api/v1/auth/me

**Purpose**: Get current authenticated user profile

**Authentication**: Required (Clerk token)

**Request Headers**:
```
Authorization: Bearer <clerk_session_token>
```

**Response** (200):
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": "clxxx123",
    "clerkId": "user_2abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "imageUrl": "https://img.clerk.com/...",
    "createdAt": "2026-07-25T10:00:00Z",
    "updatedAt": "2026-07-25T10:00:00Z"
  }
}
```

**Errors**:
- 401: Missing or invalid token
- 404: User not found in database

---

### PATCH /api/v1/auth/profile

**Purpose**: Update user profile information

**Authentication**: Required (Clerk token)

**Request Headers**:
```
Authorization: Bearer <clerk_session_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "John Updated",
  "imageUrl": "https://new-image-url.com/avatar.png"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "clxxx123",
    "name": "John Updated",
    "email": "john@example.com",
    "imageUrl": "https://new-image-url.com/avatar.png",
    "updatedAt": "2026-07-25T11:00:00Z"
  }
}
```

**Validation**:
- `name`: Optional, 1-100 characters
- `imageUrl`: Optional, valid URL

**Errors**:
- 400: Validation failed
- 401: Missing or invalid token
- 404: User not found

---

## User Synchronization

### Automatic Sync on Every Request

When `requireAuthentication` middleware is used:

1. **Clerk Token Verification**: Verify JWT signature and expiration
2. **Fetch Clerk User**: Get full user data from Clerk API
3. **Database Upsert**: 
   - If user exists (by clerkId): Update email, name, imageUrl
   - If user doesn't exist: Create new user record
4. **Attach to Request**: Set `req.user` to synced user object

### Lazy User Creation

Users are **NOT** created during Clerk webhook events. Instead:
- User is created on **first authenticated API request**
- User data is updated on every request (if changed in Clerk)
- No webhook configuration needed for MVP

### Benefits

- ✅ Simplified architecture (no webhooks needed)
- ✅ Always up-to-date user data
- ✅ Handles Clerk changes automatically
- ✅ No race conditions between webhook and API

---

## Security

### Token Verification

- Clerk SDK verifies JWT signature automatically
- Checks token expiration
- Validates issuer and audience

### Never Trust Client Input

- User ID always extracted from verified token
- Never use user ID from request body
- Ownership checks in service layer

### Protected Routes

```javascript
// ✅ Correct: Use middleware
router.get('/protected', requireAuthentication, handler);

// ❌ Wrong: Manual checking
router.get('/protected', async (req, res) => {
  const userId = req.body.userId; // Never do this!
});
```

### Environment Variables

- Clerk keys stored in `.env`
- Never committed to Git
- Validated on server startup

---

## Error Handling

### Authentication Errors

**401 Unauthorized**:
- Missing Authorization header
- Invalid token format
- Expired token
- Token signature verification failed

**500 Internal Server Error**:
- Clerk API unavailable
- Database connection failed
- Unexpected errors

### Error Response Format

```json
{
  "success": false,
  "message": "Authentication required"
}
```

---

## Validation

### Request Validation

**File**: `src/validations/auth.validation.js`

**Schemas**:
```javascript
updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  imageUrl: z.string().url().optional(),
});
```

**Usage**:
```javascript
router.patch('/profile', 
  requireAuthentication, 
  validate(updateProfileSchema), 
  updateProfile
);
```

**Validation Middleware**: `src/middleware/validate.middleware.js`

---

## Testing Authentication

### Manual Testing with Clerk

1. **Frontend Sign In**:
   - User signs in via Clerk on frontend
   - Frontend receives session token

2. **Test Sync Endpoint**:
```bash
curl -X POST http://localhost:5000/api/v1/auth/sync \
  -H "Authorization: Bearer <clerk_token>"
```

3. **Test Get Current User**:
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <clerk_token>"
```

4. **Test Update Profile**:
```bash
curl -X PATCH http://localhost:5000/api/v1/auth/profile \
  -H "Authorization: Bearer <clerk_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'
```

### Expected Behavior

**First Request** (New User):
- User created in PostgreSQL
- Returns new user object

**Subsequent Requests** (Existing User):
- User updated if Clerk data changed
- Returns existing user object

**Invalid Token**:
- Returns 401 Unauthorized
- Error message: "Invalid or expired authentication token"

**No Token**:
- Returns 401 Unauthorized
- Error message: "Authentication required"

---

## Database Schema

### User Table

```sql
CREATE TABLE "users" (
  "id" TEXT PRIMARY KEY,
  "clerkId" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "imageUrl" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX "users_clerkId_key" ON "users"("clerkId");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_clerkId_idx" ON "users"("clerkId");
CREATE INDEX "users_email_idx" ON "users"("email");
```

### Prisma Model

```prisma
model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  name      String
  email     String   @unique
  imageUrl  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  resumes    Resume[]
  interviews Interview[]
  reports    Report[]

  @@index([clerkId])
  @@index([email])
  @@map("users")
}
```

---

## Usage in Other Modules

### Protecting Routes

```javascript
import { requireAuthentication } from '../middleware/auth.middleware.js';

// Protect entire router
router.use(requireAuthentication);

// Or protect individual routes
router.get('/interviews', requireAuthentication, getInterviews);
router.post('/interviews', requireAuthentication, createInterview);
```

### Accessing Authenticated User

```javascript
export const getInterviews = asyncHandler(async (req, res) => {
  // User is available on req.user
  const userId = req.user.id;
  
  const interviews = await interviewService.getUserInterviews(userId);
  
  sendSuccess(res, { interviews });
});
```

### Ownership Verification

```javascript
export const getInterview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  // Service layer checks ownership
  const interview = await interviewService.getInterviewById(id, userId);
  
  sendSuccess(res, interview);
});
```

---

## Folder Structure

```
src/
├── config/
│   └── env.js              # Clerk configuration
├── middleware/
│   ├── auth.middleware.js   # Clerk & auth middleware
│   └── validate.middleware.js  # Validation middleware
├── controllers/
│   └── auth.controller.js   # Auth HTTP handlers
├── services/
│   └── auth.service.js      # Auth business logic
├── repositories/
│   └── user.repository.js   # User database operations
├── routes/
│   ├── auth.routes.js       # Auth endpoints
│   └── api.routes.js        # Register auth routes
└── validations/
    └── auth.validation.js   # Auth Zod schemas
```

---

## Best Practices

### 1. Always Use Middleware
```javascript
// ✅ Good
router.get('/protected', requireAuthentication, handler);

// ❌ Bad - manual verification
router.get('/protected', async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ success: false });
  }
  // ...
});
```

### 2. Use req.user.id for Ownership
```javascript
// ✅ Good - from verified token
const userId = req.user.id;

// ❌ Bad - from request body
const userId = req.body.userId;
```

### 3. Let Middleware Handle Sync
```javascript
// ✅ Good - middleware syncs automatically
router.get('/me', requireAuthentication, getCurrentUser);

// ❌ Bad - manual sync in controller
router.get('/me', async (req, res) => {
  await authService.syncUser(...);
  // ...
});
```

### 4. Return Public Data Only
```javascript
// ✅ Good - formatUserProfile hides sensitive data
return authService.formatUserProfile(user);

// ❌ Bad - returning raw database object
return user;
```

---

## Success Criteria

✅ **Clerk Connected**
- SDK installed and configured
- Environment variables set

✅ **Auth Middleware**
- Global Clerk middleware applied
- requireAuthentication middleware working
- Token verification successful

✅ **User Sync**
- POST /auth/sync creates new users
- POST /auth/sync updates existing users
- Upsert logic working correctly

✅ **Protected Routes**
- requireAuthentication blocks unauthenticated requests
- 401 returned for missing/invalid tokens
- req.user populated correctly

✅ **Current User API**
- GET /auth/me returns authenticated user
- PATCH /auth/profile updates user

✅ **Database Integration**
- Users synced to PostgreSQL
- Unique constraints enforced (clerkId, email)
- Indexes created for performance

✅ **Layered Architecture**
- Route → Controller → Service → Repository → Prisma
- Each layer has single responsibility
- No business logic in controllers
- No Prisma access outside repositories

---

**Implementation Date**: 2026-07-25  
**Status**: ✅ Complete and Verified  
**Version**: 1.0
