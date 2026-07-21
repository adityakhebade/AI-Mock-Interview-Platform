# Feature Spec 06 — Backend Clerk Verification and User Synchronization

**Status:** Ready after Prisma setup is verified  
**Prerequisites:** Completed Prisma/PostgreSQL setup, generated `init_core` migration, and a working `User` Prisma model.  
**Does not include:** Rebuilding Clerk sign-in/sign-up UI, interviews, resumes, reports, or any other product module.

## 1. Goal

Make the existing Clerk-authenticated Next.js application safe to use with the separate Express backend.

When the frontend sends a Clerk session token to the Express API, the backend must verify it, resolve a local IntervueX `User` record, and make that minimal local user context available to protected routes. The backend must never trust a client-provided user ID.

## 2. User Outcome

```text
Candidate signs in through existing Clerk UI
        ↓
Frontend obtains current Clerk session token
        ↓
Frontend calls Express API with Authorization: Bearer <token>
        ↓
Express verifies the Clerk session token
        ↓
Express finds or creates the local User record
        ↓
Protected API route receives the authenticated local user context
```

The first protected API request may create the local user record. Repeated requests must return the same user without creating duplicates.

## 3. Scope

### Build

- Clerk Express SDK integration for the separate `server/` service.
- Token verification middleware using the current non-deprecated Clerk Express pattern.
- Local `User` lookup/create/update service and repository.
- `POST /api/v1/users/sync` endpoint.
- `GET /api/v1/users/me` endpoint.
- Typed Express request augmentation for `currentUser`.
- Tests for valid identity, missing/invalid tokens, idempotent sync, and cross-request behavior.
- Minimal frontend API-client guidance for attaching the existing Clerk token.

### Do not build

- New sign-in, sign-up, Clerk UI, or Next.js proxy/middleware.
- Passwords, custom JWTs, `jsonwebtoken`, or a second authentication system.
- User-profile editing, roles, organizations, recruiters, or account deletion.
- Interview/resume/report routes.
- A Clerk webhook. Lazy synchronization on the authenticated request is sufficient for MVP Phase 1.

## 4. Dependencies and Environment Variables

Install the current official Clerk Express SDK compatible with the backend’s module system. Use Clerk’s `clerkMiddleware()` plus `getAuth()`; do not use deprecated `requireAuth()`.

Add these server-only variables to `server/.env.example` and validate required values in server configuration:

```dotenv
CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=
CLERK_AUTHORIZED_PARTIES=http://localhost:3000
# Optional only when using networkless JWT verification:
# CLERK_JWT_KEY=
```

Rules:

- `CLERK_SECRET_KEY` is never exposed to the frontend or committed.
- `CLERK_PUBLISHABLE_KEY` is required by the current Clerk backend request-authentication flow.
- `CLERK_AUTHORIZED_PARTIES` is a comma-separated allowlist of frontend origins; parse it into an array. It must include the actual local and production frontend origins.
- Reuse the existing frontend Clerk keys. Do not create a second Clerk application.
- Keep CORS `FRONTEND_URL` aligned with the Clerk authorized parties list.

## 5. Files to Create or Modify

Adapt file names only if the existing `server/` conventions differ; do not duplicate equivalent files.

```text
server/
├── src/
│   ├── config/
│   │   └── index.ts                    # Add validated Clerk configuration
│   ├── middleware/
│   │   ├── clerk.middleware.ts          # Clerk setup and requireCurrentUser
│   │   └── index.ts                     # Export middleware
│   ├── types/
│   │   └── express.d.ts                 # Add Request.currentUser typing
│   ├── repositories/
│   │   └── user.repository.ts           # Prisma-only user persistence methods
│   ├── services/
│   │   └── user.service.ts              # Sync and current-user business logic
│   ├── controllers/
│   │   └── user.controller.ts           # HTTP handlers only
│   ├── routes/
│   │   └── user.routes.ts               # /users endpoints
│   ├── validators/
│   │   └── user.validator.ts            # Empty/minimal only if endpoint input exists
│   ├── integrations/
│   │   └── clerk/                       # Optional adapter if profile lookup is isolated
│   └── app.ts                           # Register Clerk before protected routes
└── tests/
    ├── unit/user.service.test.ts
    └── integration/user.routes.test.ts
```

Use the existing `src/prisma/client.ts` singleton from the completed Prisma setup. Only `user.repository.ts` may import it.

## 6. Data Contract

The `User` table is the model defined in `04-prisma-schema.md`:

```text
id          internal UUID primary key
clerkId     unique Clerk subject ID
email       primary email used for display/contact
displayName optional full name
imageUrl    optional profile image URL
createdAt
updatedAt
```

The Clerk `userId`/subject is the only identity key used for lookup. Email is display/contact data and must not be used as the uniqueness or ownership key.

### Local request context

After authentication and sync, protected routes receive only the data they need:

```ts
type CurrentUser = {
  id: string;       // IntervueX User.id
  clerkId: string;  // Verified Clerk subject
};
```

Attach it as `req.currentUser`. Do not attach the raw token, Clerk secret, entire Clerk response, or profile data to every request.

## 7. Authentication and Synchronization Flow

### 7.1 Middleware order

```text
request ID / logger
  → security middleware
  → JSON parser
  → Clerk clerkMiddleware()
  → /health (public)
  → /api/v1 public router, if any
  → requireCurrentUser
  → protected route controller
  → not-found handler
  → central error handler
```

`clerkMiddleware()` must be registered before a route calls `getAuth(req)`. `requireCurrentUser` protects specific routers/routes, not the public health endpoint.

### 7.2 `requireCurrentUser` behavior

1. Obtain authentication state using `getAuth(req)` with accepted token type `session_token`.
2. If there is no authenticated `userId`, return standard `401 UNAUTHENTICATED` response.
3. Use the verified Clerk ID to call `userService.syncFromClerk(clerkId)`.
4. Attach `{ id, clerkId }` to `req.currentUser`.
5. Call `next()`.

The service fetches profile data from Clerk’s backend API only when needed, then upserts the local user using the unique `clerkId`.

### 7.3 Profile synchronization policy

For MVP, synchronize these fields:

- `clerkId`: always.
- `email`: Clerk primary email; required for local user creation.
- `displayName`: full name when available; otherwise null.
- `imageUrl`: Clerk image URL when available; otherwise null.

On an existing local user, update profile fields only when changed. Do not fail an otherwise valid protected request because an optional display name or image is unavailable. If Clerk cannot provide a required email for a first-time sync, return a documented `422 USER_PROFILE_INCOMPLETE` error and log the reason safely.

## 8. API Contracts

Both endpoints require a valid Clerk session token.

### `POST /api/v1/users/sync`

Synchronizes the verified identity into the local database. Request body is empty; the backend derives identity exclusively from the token.

**Success — 200 OK**

```json
{
  "success": true,
  "data": {
    "id": "c0dbe6e3-f6a0-4c08-a702-6e462ca2f543",
    "email": "candidate@example.com",
    "displayName": "Candidate Name",
    "imageUrl": "https://img.clerk.com/example",
    "createdAt": "2026-07-20T10:00:00.000Z",
    "updatedAt": "2026-07-20T10:00:00.000Z"
  }
}
```

**Errors**

| Status | Code | Meaning |
| --- | --- | --- |
| 401 | `UNAUTHENTICATED` | Token is missing, invalid, expired, or not a session token. |
| 422 | `USER_PROFILE_INCOMPLETE` | First-time Clerk profile lacks required email data. |
| 500 | `INTERNAL_ERROR` | Unexpected backend/database/provider failure. |

### `GET /api/v1/users/me`

Returns the authenticated local IntervueX user. If the local record is absent, the same synchronization logic runs first so this endpoint is safe as the frontend’s initial API call.

**Success — 200 OK**

```json
{
  "success": true,
  "data": {
    "id": "c0dbe6e3-f6a0-4c08-a702-6e462ca2f543",
    "email": "candidate@example.com",
    "displayName": "Candidate Name",
    "imageUrl": "https://img.clerk.com/example",
    "createdAt": "2026-07-20T10:00:00.000Z",
    "updatedAt": "2026-07-20T10:00:00.000Z"
  }
}
```

Never return `clerkId` to the client unless a later verified UI requirement needs it.

## 9. Repository and Service Contracts

### Repository methods

```text
findByClerkId(clerkId)
upsertFromClerkProfile(profile)
```

`upsertFromClerkProfile` uses Prisma’s unique `clerkId` constraint to prevent race-condition duplicates. It contains only Prisma queries; it does not call Clerk or know Express.

### Service methods

```text
syncFromClerk(clerkId)
getCurrentUser(localUserId)
```

`syncFromClerk` obtains a profile through a dedicated Clerk adapter/client, validates/normalizes the profile, and delegates persistence to the repository. `getCurrentUser` returns the public response DTO. Services enforce business behavior; they do not read `req` or write `res`.

## 10. Frontend Integration Requirements

Do not change Clerk sign-in/sign-up pages or Next.js route protection.

Add/update only the dedicated frontend API client:

1. Obtain the existing Clerk token using the supported Clerk client-side session method.
2. Send the token with cross-origin Express requests:

   ```text
   Authorization: Bearer <session token>
   ```

3. Call `GET /api/v1/users/me` after the application is ready to make authenticated API requests, or call `POST /api/v1/users/sync` explicitly during onboarding.
4. Handle `401` by treating the session as unavailable and avoid exposing raw backend errors.

Do not send the Clerk secret key from the browser. Do not use a frontend-supplied user ID.

## 11. Required Tests

### Unit tests

- Creates a local user the first time a valid Clerk profile is synchronized.
- Returns/updates the same local user on a repeated sync; no duplicate `clerkId` record exists.
- Maps profile name, email, and image safely.
- Rejects a first-time profile without a required email with `USER_PROFILE_INCOMPLETE`.
- Never passes raw Clerk provider details through the public user DTO.

### Integration tests

- `POST /api/v1/users/sync` with a mocked verified session returns 200 and standard envelope.
- `GET /api/v1/users/me` returns the synchronized user.
- Missing or invalid token returns standard 401 envelope.
- Health endpoint remains accessible without authentication.
- A protected test route sees `req.currentUser` with internal ID and Clerk ID only.
- Tests use a dedicated test database and mock Clerk calls; they never call a live Clerk account.

## 12. Acceptance Checklist

- [ ] Prisma setup and `init_core` migration are completed and verified first.
- [ ] Existing Clerk frontend authentication remains unchanged.
- [ ] Current official Clerk Express middleware is used; no deprecated `requireAuth()`.
- [ ] Protected Express routes verify the Clerk session token.
- [ ] Authorized-party origins are configured and not left open.
- [ ] The first authenticated request safely creates a local `User` record.
- [ ] Repeated sync is idempotent; `clerkId` remains unique.
- [ ] `req.currentUser` contains only internal user ID and verified Clerk ID.
- [ ] `POST /users/sync` and `GET /users/me` follow the standard response/error envelopes.
- [ ] Unit and integration tests pass without live Clerk or production database access.
- [ ] `progress-tracker.md` documents completion and verification results.

## 13. AI Execution Prompt

```text
Implement only Feature Spec 06: Backend Clerk Verification and User Synchronization.

Read CLAUDE.md, project context documents, progress-tracker.md, every docs/backend rulebook,
and docs/specs/06-user-sync.md. Confirm Prisma setup and the init_core migration are complete
before changing code. If they are not complete, stop and report the prerequisite.

Keep the existing Clerk frontend authentication, sign-in/sign-up UI, and Next.js route
protection unchanged. In the Express server, use the current official Clerk Express SDK
with clerkMiddleware() and getAuth(); do not use deprecated requireAuth() and do not create
a custom JWT system.

Implement only: validated Clerk environment configuration, protected-route middleware,
typed req.currentUser, a User repository, User service, POST /api/v1/users/sync, and
GET /api/v1/users/me. Derive identity only from the verified Clerk token, synchronize the
local User record idempotently using unique clerkId, and enforce the shared API envelopes.

Use a dedicated frontend API client only for passing the existing Clerk session token to
the Express backend; do not alter the authentication UI. Add unit and integration tests
with mocked Clerk calls and a test database. Run formatting, linting, TypeScript checks,
tests, and a health check. Update progress-tracker.md with exact changed files and results,
then stop. Do not implement interviews, resumes, reports, evaluation, or dashboard data.
```

## 14. Git Metadata and Next Step

| Item | Recommendation |
| --- | --- |
| Branch | `feat/backend-user-sync` |
| Commit | `feat(auth): verify Clerk sessions and sync local users` |
| Pull request title | `feat(auth): verify Clerk sessions and sync local users` |

After this specification is fully implemented and verified, create `docs/specs/07-interview-module.md`. That specification will build only interview CRUD and lifecycle transitions using the authenticated local user context from this feature.

## References

Use the current Clerk Express guidance: Clerk’s Express SDK uses `clerkMiddleware()` with `getAuth()` for request authentication, while `requireAuth()` is deprecated. For cross-origin backend requests, the frontend must send its session token in the `Authorization` header. [Clerk Express `getAuth`](https://clerk.com/docs/reference/express/get-auth) · [Clerk authenticated requests](https://clerk.com/docs/guides/development/making-requests)
