# User Module Documentation

## Overview

The User Module manages authenticated user profile information. Authentication and user synchronization are handled by the Authentication Module. This module only provides profile retrieval and updates.

**Status**: ✅ Implemented and Working

---

## Features

- ✅ Get current user profile
- ✅ Update user profile (name, imageUrl)
- ✅ Input validation with Zod
- ✅ Authorization (user can only update their own profile)
- ✅ Follows layered architecture

---

## Architecture

### Module Flow

```
GET/PATCH /api/v1/users/me
         ↓
requireAuthentication Middleware
         ↓
Validation Middleware (PATCH only)
         ↓
User Controller
         ↓
User Service
         ↓
User Repository
         ↓
Prisma
         ↓
PostgreSQL
```

---

## Implementation

### 1. Repository Layer

**File**: `src/repositories/user.repository.js`

**Methods Used**:
- `findById(id)` - Find user by internal ID
- `updateUser(id, updateData)` - Update user profile

**Note**: The user repository was already created in the Authentication Module. This module reuses those methods.

---

### 2. Service Layer

**File**: `src/services/user.service.js`

**Methods**:

#### getCurrentUser(userId)
- Fetches user by ID
- Returns formatted user profile
- Throws 404 if user not found

```javascript
const user = await userService.getCurrentUser(req.user.id);
```

#### updateProfile(userId, updateData)
- Validates user exists
- Filters allowed update fields (name, imageUrl)
- Updates user in database
- Returns formatted updated profile

```javascript
const updated = await userService.updateProfile(req.user.id, {
  name: 'John Doe',
  imageUrl: 'https://example.com/avatar.jpg'
});
```

#### formatUserProfile(user)
- Formats user object for API response
- Only includes public fields
- Hides sensitive internal data

**Business Rules**:
- Email cannot be updated (managed by Clerk)
- ClerkId cannot be updated (immutable)
- Only name and imageUrl can be updated
- User ID always from `req.user.id`, never from request body

---

### 3. Controller Layer

**File**: `src/controllers/user.controller.js`

**Handlers**:

#### getCurrentUser
- GET /api/v1/users/me
- Extracts userId from req.user (set by auth middleware)
- Calls userService.getCurrentUser()
- Returns formatted response

#### updateProfile
- PATCH /api/v1/users/me
- Extracts userId from req.user
- Extracts name and imageUrl from request body
- Calls userService.updateProfile()
- Returns formatted response

**Note**: Controllers only handle HTTP - no business logic.

---

### 4. Validation Layer

**File**: `src/validations/user.validation.js`

**Schemas**:

#### updateProfileSchema
```javascript
{
  name: string (2-50 chars, optional),
  imageUrl: string (valid URL, optional)
}
```

**Validation Rules**:
- `name`: 
  - Optional field
  - Minimum 2 characters
  - Maximum 50 characters
  - Automatically trimmed
- `imageUrl`:
  - Optional field
  - Must be valid URL format
  - Can be null
- **Strict mode**: Extra fields not allowed

**Usage**:
```javascript
router.patch('/me', validate(updateProfileSchema), updateProfile);
```

---

### 5. Routes

**File**: `src/routes/user.routes.js`

**Base Path**: `/api/v1/users`

**All routes require authentication** (applied via `router.use(requireAuthentication)`)

| Method | Endpoint | Middleware | Description |
|--------|----------|------------|-------------|
| GET | `/me` | requireAuthentication | Get current user profile |
| PATCH | `/me` | requireAuthentication, validate | Update user profile |

**Registration**: Routes registered in `src/routes/api.routes.js`

---

## API Endpoints

### GET /api/v1/users/me

**Purpose**: Get current authenticated user profile

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

**Error Responses**:
- 401 Unauthorized: Missing or invalid token
- 404 Not Found: User not found in database

---

### PATCH /api/v1/users/me

**Purpose**: Update current authenticated user profile

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
  "imageUrl": "https://new-avatar.com/image.jpg"
}
```

**Note**: Both fields are optional. Send only the fields you want to update.

**Response** (200):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "clxxx123",
    "clerkId": "user_2abc123",
    "name": "John Updated",
    "email": "john@example.com",
    "imageUrl": "https://new-avatar.com/image.jpg",
    "createdAt": "2026-07-25T10:00:00Z",
    "updatedAt": "2026-07-25T11:30:00Z"
  }
}
```

**Validation Errors** (400):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Name must be at least 2 characters"
    },
    {
      "field": "imageUrl",
      "message": "Must be a valid URL"
    }
  ]
}
```

**Error Responses**:
- 400 Bad Request: Validation failed or no fields to update
- 401 Unauthorized: Missing or invalid token
- 404 Not Found: User not found

---

## Business Rules

### 1. Immutable Fields

**Cannot be updated**:
- `id` - Internal primary key
- `clerkId` - Clerk user identifier
- `email` - Managed by Clerk
- `createdAt` - Set on creation
- `updatedAt` - Auto-managed by Prisma

**Can be updated**:
- `name` - User's display name
- `imageUrl` - Profile picture URL

### 2. Authorization

- User can **only** update their own profile
- User ID taken from `req.user.id` (verified token)
- User ID **never** accepted from request body
- Middleware ensures user is authenticated

### 3. Validation

- All inputs validated before reaching business logic
- Invalid data rejected with 400 status
- Field-level error messages provided
- Extra fields not allowed (strict validation)

---

## Security

### Authentication

- All endpoints require valid Clerk token
- Token verified by `requireAuthentication` middleware
- 401 returned if missing or invalid

### Authorization

- User can only access their own profile
- User ID from verified token (`req.user.id`)
- No way to access other users' profiles

### Input Validation

- Zod schemas validate all inputs
- SQL injection prevented by Prisma (parameterized queries)
- XSS prevention via input sanitization
- URL validation for imageUrl

### Data Exposure

- Only public fields returned in responses
- Sensitive data never exposed
- `formatUserProfile()` ensures safe output

---

## Testing

### Manual Testing

#### Get Current User
```bash
curl -X GET http://localhost:5000/api/v1/users/me \
  -H "Authorization: Bearer <clerk_token>"
```

#### Update Profile (Name Only)
```bash
curl -X PATCH http://localhost:5000/api/v1/users/me \
  -H "Authorization: Bearer <clerk_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'
```

#### Update Profile (Name and Image)
```bash
curl -X PATCH http://localhost:5000/api/v1/users/me \
  -H "Authorization: Bearer <clerk_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "imageUrl":"https://example.com/avatar.jpg"
  }'
```

#### Test Validation Error (Name Too Short)
```bash
curl -X PATCH http://localhost:5000/api/v1/users/me \
  -H "Authorization: Bearer <clerk_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"A"}'
```

Expected: 400 with validation error

#### Test Validation Error (Invalid URL)
```bash
curl -X PATCH http://localhost:5000/api/v1/users/me \
  -H "Authorization: Bearer <clerk_token>" \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"not-a-url"}'
```

Expected: 400 with validation error

---

## Error Handling

### Common Errors

**401 Unauthorized**:
- Missing Authorization header
- Invalid Clerk token
- Expired token

**400 Bad Request**:
- Validation failed (name too short/long)
- Invalid URL format for imageUrl
- No fields provided to update
- Extra fields in request body

**404 Not Found**:
- User does not exist in database
- (Rare: should not happen if auth works correctly)

### Error Response Format

```json
{
  "success": false,
  "message": "Error description"
}
```

Validation errors include field-level details:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Name must be at least 2 characters"
    }
  ]
}
```

---

## Folder Structure

```
src/
├── controllers/
│   └── user.controller.js      # HTTP handlers for user endpoints
├── services/
│   └── user.service.js          # Business logic for user management
├── repositories/
│   └── user.repository.js       # Database operations (reused from auth)
├── routes/
│   └── user.routes.js           # User endpoint definitions
├── validations/
│   └── user.validation.js       # Zod schemas for validation
└── middleware/
    ├── auth.middleware.js       # Authentication (reused)
    └── validate.middleware.js   # Validation (reused)
```

---

## Database Schema

### User Table

The User table is shared with the Authentication Module:

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
```

**Indexes**:
- `users_clerkId_key` (unique)
- `users_email_key` (unique)
- `users_clerkId_idx`
- `users_email_idx`

---

## Integration with Other Modules

### Authentication Module

- **Reuses**: `userRepository` from auth module
- **Depends on**: `requireAuthentication` middleware
- **Uses**: `req.user` object populated by auth

### Future Modules

**Interview Module** will use:
```javascript
const userId = req.user.id; // From auth
const interviews = await interviewService.getUserInterviews(userId);
```

**Resume Module** will use:
```javascript
const userId = req.user.id; // From auth
const resume = await resumeService.uploadResume(userId, file);
```

**Pattern**: All modules use `req.user.id` for ownership verification.

---

## Best Practices

### 1. Always Use req.user.id

```javascript
// ✅ Good - from verified token
const userId = req.user.id;

// ❌ Bad - from request body
const userId = req.body.userId;
```

### 2. Validate All Inputs

```javascript
// ✅ Good - validation middleware
router.patch('/me', validate(updateProfileSchema), updateProfile);

// ❌ Bad - no validation
router.patch('/me', updateProfile);
```

### 3. Format Response Data

```javascript
// ✅ Good - use formatUserProfile
return userService.formatUserProfile(user);

// ❌ Bad - return raw database object
return user;
```

### 4. Handle Errors Properly

```javascript
// ✅ Good - throw AppError with proper code
if (!user) {
  throw new AppError('User not found', 404);
}

// ❌ Bad - generic error
if (!user) {
  throw new Error('Not found');
}
```

---

## Comparison: Auth vs User Module

### Authentication Module (`/api/v1/auth`)

**Purpose**: User authentication and synchronization

**Endpoints**:
- POST `/auth/sync` - Sync user from Clerk
- GET `/auth/me` - Get authenticated user
- PATCH `/auth/profile` - Update profile

**When to use**:
- Initial user sync after Clerk login
- Getting authenticated user info

### User Module (`/api/v1/users`)

**Purpose**: User profile management

**Endpoints**:
- GET `/users/me` - Get current user profile
- PATCH `/users/me` - Update profile

**When to use**:
- User profile pages
- Profile update forms
- User settings

**Note**: Both modules can update profiles. The auth module is for authentication-related operations, while the user module is for profile management. For consistency, prefer `/users/me` for profile operations.

---

## Success Criteria

✅ **GET /users/me works**
- Returns authenticated user profile
- Requires valid Clerk token
- Returns 401 if unauthenticated

✅ **PATCH /users/me works**
- Updates name and/or imageUrl
- Validates input with Zod
- Returns updated profile

✅ **Validation working**
- Name length validated (2-50 chars)
- URL format validated
- Extra fields rejected
- Field-level error messages

✅ **Authorization working**
- User can only access their own profile
- User ID from req.user.id only
- Never accepts userId from client

✅ **Layered architecture maintained**
- Controller: HTTP only
- Service: Business logic
- Repository: Database access
- Clear separation of concerns

✅ **Ready for Resume Module**
- Pattern established for user-owned resources
- Ownership verification working
- Can be reused for resumes, interviews, reports

---

## Common Issues and Solutions

### Issue: "User not found" after authentication

**Cause**: User was authenticated by Clerk but not synced to database

**Solution**: Call POST `/auth/sync` first, or ensure `requireAuthentication` middleware syncs users

---

### Issue: Validation errors not showing

**Cause**: Validation middleware not applied to route

**Solution**: Ensure route uses `validate(schema)` middleware
```javascript
router.patch('/me', validate(updateProfileSchema), updateProfile);
```

---

### Issue: Can update other users' profiles

**Cause**: Using userId from request body instead of token

**Solution**: Always use `req.user.id`
```javascript
// ✅ Correct
const userId = req.user.id;

// ❌ Wrong
const userId = req.params.userId; // Never do this
```

---

### Issue: Email not updating

**Cause**: Email is managed by Clerk, not the backend

**Solution**: Email must be updated through Clerk interface, not this API

---

## Next Steps

User Module is complete. Ready to implement:

1. **Resume Module** - File upload, Cloudinary integration
2. **Interview Module** - CRUD with ownership verification
3. **Question Module** - Generate and manage questions
4. **Submission Module** - Save answers
5. **Evaluation Module** - AI evaluation
6. **Report Module** - Generate reports

All future modules will follow the same pattern:
- Use `requireAuthentication` middleware
- Use `req.user.id` for ownership
- Validate inputs with Zod
- Follow layered architecture

---

**Implementation Date**: 2026-07-25  
**Status**: ✅ Complete and Verified  
**Version**: 1.0
