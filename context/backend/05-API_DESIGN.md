# IntervueX API Design Standards

**Status:** API contract rulebook  
**Prerequisites:** `01-backend-setup.md` through `04-prisma-schema.md`  
**Scope:** Shared REST API conventions and the MVP endpoint map. Feature specifications define detailed request/response DTOs and implementation steps.

## 1. Purpose

This document makes every IntervueX API endpoint predictable for the Next.js frontend and maintainable for the backend. It standardizes URLs, authentication, validation, status codes, response envelopes, pagination, errors, and ownership behavior before feature endpoints are implemented.

This is a contract guide, not an instruction to implement all listed endpoints now. Each endpoint is implemented only through its approved feature specification.

## 2. API Base and Versioning

```text
Development API base: http://localhost:4000/api/v1
Health endpoint:        http://localhost:4000/health
```

All product endpoints are mounted below `/api/v1`. The health route remains outside the versioned API because it is infrastructure-facing and public.

Use a new API version only for intentional breaking changes to public request/response contracts. Add optional response fields or new endpoints without creating a new version.

## 3. URL and Method Conventions

- Use plural, lowercase resource nouns: `/interviews`, `/resumes`, `/reports`.
- Use path parameters for a specific resource: `/interviews/:interviewId`.
- Use query parameters for listing concerns: `?page=1&pageSize=20&status=COMPLETED`.
- Use `POST` to create resources, `GET` to read, `PATCH` for partial updates, and `DELETE` only for an approved irreversible deletion workflow.
- Avoid verbs in URLs. A documented domain transition may use a subresource action, for example `POST /interviews/:interviewId/complete`.
- Use opaque UUIDs in paths; never expose a user ID as an ownership selector.

## 4. Authentication and Ownership Contract

Except for `/health`, all MVP product endpoints require a valid Clerk session token.

```text
Authorization: Bearer <Clerk session token>
```

The backend verifies the token, resolves/synchronizes the local IntervueX user, and places the minimal user context on the request. The client never submits a `userId` to claim ownership.

Services enforce ownership for every resource read or change. For user-owned resources that are missing or belong to another user, return `404 NOT_FOUND`. This avoids revealing whether another user’s interview or resume exists.

## 5. Request Validation

All path parameters, query parameters, headers needed by the route, and JSON bodies are parsed by Zod middleware before the controller runs.

- Reject unknown or malformed values when the endpoint requires strict input.
- Trim string input where whitespace has no meaning.
- Require positive integers for page and page-size values.
- Use enum validation for persisted state values.
- Enforce request-body size limits in app middleware.
- Never trust client totals, scores, user IDs, timestamps, status transitions, or file metadata.

Validation failures use the standard `VALIDATION_ERROR` envelope and HTTP 400.

## 6. Response Envelopes

Every JSON API response follows one shape.

### Successful single resource

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "role": "Frontend Developer"
  }
}
```

### Successful list

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": [
      { "path": "durationMinutes", "message": "Must be at least 5" }
    ]
  }
}
```

`meta` is omitted for non-list responses unless an endpoint has documented metadata. Date values are ISO-8601 strings. Decimal Prisma values are mapped to JSON-safe numbers or strings before responses are sent.

## 7. HTTP Status Rules

| Status | Use |
| --- | --- |
| `200 OK` | Successful read, update, or domain action returning data. |
| `201 Created` | Successful resource creation; include the created resource. |
| `204 No Content` | Approved deletion with no response body. |
| `400 Bad Request` | Invalid input or malformed request. |
| `401 Unauthorized` | Missing, expired, or invalid Clerk token. |
| `403 Forbidden` | Authenticated caller lacks permission to a non-user-owned administrative resource; uncommon in MVP. |
| `404 Not Found` | Resource missing or not owned by caller. |
| `409 Conflict` | Duplicate/invalid concurrent state, such as a second evaluation. |
| `422 Unprocessable Content` | Well-formed request violates a documented business rule. |
| `429 Too Many Requests` | Rate limit exceeded, once rate limiting is introduced. |
| `500 Internal Server Error` | Unexpected server failure; never leak internals. |

## 8. Pagination, Filtering, and Sorting

List endpoints use offset pagination for the MVP:

```text
GET /api/v1/interviews?page=1&pageSize=20&status=COMPLETED
```

Rules:

- Default `page` is `1`.
- Default `pageSize` is `20`; maximum is `100`.
- Results use a stable default sort, normally `createdAt DESC`.
- Filters are explicit and feature-specific; do not implement generic arbitrary column filtering.
- Whitelist supported sort keys rather than passing a client-provided database field directly to Prisma.

Feature specs must state their supported filters and sort options. A future high-volume history view may replace this with cursor pagination through a versioned/compatible contract.

## 9. MVP Endpoint Map

The map shows intended API surface, not current implementation status.

| Module | Endpoint | Purpose | Feature spec |
| --- | --- | --- | --- |
| User | `POST /users/sync` | Resolve/create local user from verified Clerk identity. | `01-user-sync.md` |
| User | `GET /users/me` | Return authenticated local user profile. | `01-user-sync.md` |
| Interview | `POST /interviews` | Create a draft interview. | `02-interview-module.md` |
| Interview | `GET /interviews` | List current user’s interviews. | `02-interview-module.md` |
| Interview | `GET /interviews/:interviewId` | Fetch an owned interview. | `02-interview-module.md` |
| Interview | `PATCH /interviews/:interviewId` | Update allowed draft details. | `02-interview-module.md` |
| Interview | `POST /interviews/:interviewId/start` | Begin a draft interview. | `02-interview-module.md` |
| Interview | `POST /interviews/:interviewId/complete` | Complete an active interview. | `02-interview-module.md` |
| Question | `GET /interviews/:interviewId/questions` | Read ordered owned-session questions. | `03-question-module.md` |
| Question | `PATCH /questions/:questionId` | Update candidate question progress where allowed. | `03-question-module.md` |
| Submission | `PUT /questions/:questionId/submission` | Save current draft/final answer. | `03-question-module.md` |
| Resume | `POST /resumes` | Create an approved upload workflow/metadata record. | `04-resume-module.md` |
| Resume | `GET /resumes` | List current user’s resumes. | `04-resume-module.md` |
| Resume | `DELETE /resumes/:resumeId` | Controlled delete after storage cleanup. | `04-resume-module.md` |
| Report | `GET /reports` | List report summaries for current user. | `05-report-module.md` |
| Report | `GET /reports/:interviewId` | Return an owned interview report. | `05-report-module.md` |
| Dashboard | `GET /dashboard/summary` | Return aggregate data for current user. | `06-dashboard-module.md` |

Question generation, AI evaluation, upload transfer protocols, and report generation are not exposed until their corresponding specs approve their behavior.

## 10. State-Transition Endpoints

State transitions must be explicit and idempotency-aware.

| Action | Preconditions | Result |
| --- | --- | --- |
| Start interview | Caller owns interview; status is `DRAFT` | Status becomes `IN_PROGRESS`; `startedAt` is set. |
| Complete interview | Caller owns interview; status is `IN_PROGRESS` | Status becomes `COMPLETED`; `endedAt` is set; evaluation workflow may begin later. |
| Cancel interview | Caller owns interview; status is `DRAFT` or `IN_PROGRESS` | Status becomes `CANCELLED`; `endedAt` is set. |

Repeating a completed action must not create duplicate evaluations or corrupt timestamps. The feature spec defines whether a repeated request returns the current resource (`200`) or a state conflict (`409`).

## 11. Error Codes

Use machine-readable codes independent of user-facing wording:

```text
VALIDATION_ERROR
UNAUTHENTICATED
FORBIDDEN
NOT_FOUND
CONFLICT
BUSINESS_RULE_VIOLATION
RATE_LIMITED
INTERNAL_ERROR
```

Controllers/services may add feature-specific error codes only when clients need to distinguish a documented situation, for example `INTERVIEW_NOT_DRAFT`. Every new code must be documented in its feature specification and mapped by central error handling.

## 12. API Documentation and Change Management

Each implemented feature specification must document:

- Endpoint method and path.
- Authentication requirement.
- Request body, path, and query DTOs.
- Success response example and status.
- Expected error codes.
- Ownership and state-transition rules.
- Pagination/filtering behavior for list routes.
- Tests covering happy path, invalid input, missing authentication, and cross-user access.

Do not make silent contract changes. Update the feature spec, frontend API client/types, tests, and progress tracker in the same pull request when a contract changes.

## 13. Frontend API Client Rules

The Next.js frontend uses a dedicated API client/service layer, not raw duplicated `fetch()` calls scattered through components.

- Read the backend base URL from a public frontend environment variable.
- Attach the current Clerk session token only for protected calls.
- Parse the common response envelope in one place.
- Map API error codes to useful UI messages; never display an untrusted raw server stack/message.
- Keep frontend API request/response types synchronized with backend DTOs without importing backend source files into the Next.js app.

## 14. AI Implementation Prompt

```text
Read CLAUDE.md, relevant docs/context documents, and all files in docs/backend/.
Treat docs/backend/05-api-design.md as the mandatory REST API contract.

When implementing an approved IntervueX feature, create only the endpoints assigned to
that feature specification. Mount them under /api/v1, require verified Clerk identity
for product routes, validate all untrusted input with Zod, enforce ownership in services,
and use the documented success/error envelopes and HTTP status rules.

Do not implement every endpoint in the endpoint map at once. Do not accept a userId from
the client for ownership. Do not expose raw Prisma records, secrets, private rubrics, or
provider output. Document and test every endpoint contract in its feature spec, run the
verification commands, then update the progress tracker.
```

## 15. Completion Checklist

- [ ] API version and route conventions are understood before a feature route is added.
- [ ] Each endpoint has typed request validation and a deliberate response DTO.
- [ ] Product endpoints require verified identity and enforce local ownership.
- [ ] Successful and failed responses use the standard envelopes.
- [ ] List endpoints use stable pagination with a bounded page size.
- [ ] State actions document preconditions and repeated-call behavior.
- [ ] Feature specs, frontend client types, tests, and progress tracker change together when a contract changes.

## 16. Git Metadata and Next Step

| Item | Recommendation |
| --- | --- |
| Branch | `docs/api-design` |
| Commit | `docs(backend): define MVP API design standards` |
| Pull request title | `docs(backend): define MVP API design standards` |

This completes the lean backend rulebook set. Next, create `docs/specs/01-user-sync.md`, the first implementation specification. It will add Clerk token verification for the Express API and synchronize the authenticated Clerk identity into the local `User` table without rebuilding the existing frontend authentication UI.
