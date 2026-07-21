# IntervueX Backend Architecture

**Status:** Design specification  
**Prerequisite:** `docs/backend/01-backend-setup.md`  
**Audience:** Contributors and AI coding agents  
**Scope:** Architectural contracts for all backend modules. This document does not create database models or feature endpoints.

## 1. Purpose

This document defines how IntervueX backend code is organized and how its layers interact. It prevents feature work from becoming a collection of routes that query Prisma directly, which would make ownership checks, testing, and future changes difficult.

The architecture uses a modular layered design:

```text
HTTP Route → Controller → Service → Repository → Prisma → PostgreSQL
```

Each layer has one responsibility. Dependencies move only from the HTTP edge toward persistence. The Next.js frontend communicates with the Express API; it never imports Prisma or connects to PostgreSQL.

## 2. Architecture Principles

- **Separation of concerns:** HTTP, business rules, and persistence remain in different layers.
- **Feature ownership:** Every database read or change is authorized for the current IntervueX user.
- **Explicit contracts:** Validate input at the API boundary and return intentional response DTOs.
- **Testability:** Services can be tested using repository interfaces or mocks; controllers can be tested without a real database.
- **Incremental delivery:** Build one vertical slice at a time without creating unused abstractions.
- **Safe evolution:** Use `/api/v1` and migration-based schema changes so future changes are deliberate.
- **No hidden coupling:** A module must not reach into another module’s repository or controller.

## 3. System Context

```text
Next.js frontend
      │ HTTPS + Clerk session token
      ▼
Express API (/api/v1)
      │ verifies identity and validates request data
      ▼
Application services
      │ applies business and ownership rules
      ▼
Repositories
      │ Prisma Client
      ▼
PostgreSQL

External services, introduced only when required:
Clerk · Gemini · object storage · Socket.IO
```

Clerk owns identity authentication. IntervueX owns its application profile and all application records. External APIs are accessed through a dedicated integration/service boundary, never directly from controllers or repositories.

## 4. Module Structure

Organize feature code by responsibility at first, and group files with clear feature prefixes. As modules become larger, move that feature into a self-contained module folder while retaining the same layer rules.

### Initial structure

```text
src/
├── controllers/
│   ├── user.controller.ts
│   └── interview.controller.ts
├── repositories/
│   ├── user.repository.ts
│   └── interview.repository.ts
├── routes/
│   ├── user.routes.ts
│   └── interview.routes.ts
├── services/
│   ├── user.service.ts
│   └── interview.service.ts
├── validators/
│   ├── user.validator.ts
│   └── interview.validator.ts
└── ...shared foundation folders
```

### Target structure for a substantial feature

```text
src/modules/interviews/
├── interview.routes.ts
├── interview.controller.ts
├── interview.service.ts
├── interview.repository.ts
├── interview.validator.ts
├── interview.dto.ts
├── interview.mapper.ts
└── interview.types.ts
```

Choose one organization style for a feature and do not mix duplicate files across both locations. Until there are at least two or three files specific to a feature, the initial structure is easier to navigate. Module directories become appropriate when feature complexity justifies them.

## 5. Layer Responsibilities

| Layer | Responsible for | Must not do |
| --- | --- | --- |
| Route | URL, HTTP method, middleware composition | Query data or contain business decisions |
| Controller | Convert HTTP request to service input; select HTTP status and response envelope | Access Prisma, embed business logic, or verify ownership manually |
| Validator | Parse and validate path, query, and body data with Zod | Perform database lookups |
| Service | Business rules, state transitions, user ownership, transactions, orchestration | Import Express request/response objects |
| Repository | Prisma reads/writes and persistence-specific query shaping | Make authorization or product decisions |
| Mapper / DTO | Convert domain or persistence values into stable API output | Query the database |
| Middleware | Cross-cutting request behavior such as auth, errors, and request IDs | Implement feature workflows |

### Allowed dependency direction

```text
routes → middleware / validators / controllers
controllers → services / DTOs
services → repositories / mappers / domain types
repositories → prisma client
```

Prohibited examples:

- A controller importing Prisma.
- A repository importing an Express type.
- A service accepting `Request` or returning `Response`.
- One feature calling another feature’s repository.
- A validator calling an external API or database.
- A route building its own response after calling a repository.

## 6. Request Processing Pattern

For a protected endpoint such as creating an interview:

```text
POST /api/v1/interviews
  → requireAuth verifies the Clerk token and attaches currentUser
  → validate(createInterviewSchema) parses untrusted input
  → interviewController.create()
  → interviewService.create(currentUser.id, validatedInput)
  → interviewRepository.create(...)
  → interviewMapper.toResponse(...)
  → 201 { success: true, data: interview }
```

The controller passes only primitive values or defined DTOs to the service. The service receives the authenticated application user ID, not the raw Clerk token. The actual mapping from Clerk identity to local user will be specified in `05-authentication.md`.

## 7. DTOs and Response Mapping

### Input DTOs

Validators produce typed input DTOs. Keep them independent from Prisma-generated types so API contracts do not accidentally mirror the database.

```ts
type CreateInterviewInput = {
  role: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  durationMinutes: number;
  language: string;
};
```

### Output DTOs

Services return a deliberate output shape, mapped from a repository result. Do not expose internal IDs, Clerk metadata, tokens, raw provider payloads, or fields reserved for future internal use.

```ts
type InterviewResponse = {
  id: string;
  role: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  status: "DRAFT" | "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
};
```

Use ISO-8601 strings for dates in JSON responses. Response mappers should be simple, deterministic functions that can be unit tested.

### Response envelope

All API endpoints return the envelope established in `01-backend-setup.md`:

```json
{ "success": true, "data": {}, "meta": {} }
```

List endpoints put pagination information in `meta`. Error responses use the shared error envelope and never include a stack trace in production.

## 8. Authentication and Authorization Boundaries

Authentication answers **who is calling**. Authorization answers **whether that caller may access this resource**.

1. Clerk middleware verifies the incoming session token.
2. Authentication middleware obtains the Clerk subject ID.
3. The user service finds or synchronizes the local IntervueX user record.
4. Middleware attaches a minimal `currentUser` context to the request.
5. Services enforce record ownership before reading, updating, or deleting user-owned data.

Never trust a `userId` from a request body or query string for ownership. The service uses the authenticated `currentUser.id`. For example, `getInterview(interviewId, currentUserId)` must ensure the interview belongs to that user before returning it.

Authentication middleware may know Express. Services must not. Authorization is a service responsibility because it is tied to application data and must also apply when workflows are called outside an HTTP controller.

## 9. Error Architecture

Expected errors are represented with a typed application error containing a safe code, HTTP status, and optional structured details.

| Situation | Error code | HTTP status |
| --- | --- | --- |
| Invalid request data | `VALIDATION_ERROR` | 400 |
| Missing/invalid authentication | `UNAUTHENTICATED` | 401 |
| User lacks access | `FORBIDDEN` | 403 |
| Resource does not exist or is not owned | `NOT_FOUND` | 404 |
| Duplicate/conflicting state | `CONFLICT` | 409 |
| Known business-rule failure | `BUSINESS_RULE_VIOLATION` | 422 |
| Unexpected failure | `INTERNAL_ERROR` | 500 |

Services throw expected application errors. Controllers either allow them to reach the central error middleware or use one approved async-handler pattern. Repositories translate known persistence conflicts into a repository/domain-safe error only when the service needs to make a business decision. The central error middleware logs the underlying failure and returns a safe standardized response.

## 10. Prisma and Repository Pattern

Prisma is an infrastructure concern. A singleton Prisma Client will be created in `src/prisma/client.ts` during the Prisma setup phase and imported only by repositories.

Repository methods should describe application persistence intent rather than generic database operations:

```text
findByClerkId(clerkId)
createForUser(userId, input)
findOwnedById(interviewId, userId)
listForUser(userId, options)
markCompleted(interviewId, endedAt)
```

Avoid vague methods such as `getAll()` where ownership, pagination, and filtering are important. Repositories may use Prisma `select` and `include` to return only data needed by the service. Do not leak full Prisma query objects to controllers.

### Transaction guidelines

Use a Prisma transaction when a workflow changes multiple records that must succeed or fail together. Examples for later phases include creating an interview with generated questions, or completing an interview with submissions and evaluation metadata.

- Start transactions in the service, where the full business workflow is known.
- Keep transactions short; do not call Gemini, object storage, or other network services inside one.
- Pass the transaction client to repository methods only when required.
- Compensate or retry external work outside the database transaction using a documented workflow.

## 11. API Versioning and Routing

All feature routes are mounted under `/api/v1`:

```text
/health
/api/v1/users/me
/api/v1/interviews
/api/v1/resumes
/api/v1/reports
```

Use plural nouns for collections and HTTP methods for actions that map to resource state. Prefer a state update (`PATCH /interviews/:id`) over action-style routes. An explicit action endpoint is acceptable only when it represents a meaningful domain action, for example `POST /interviews/:id/complete`; document its state transition and idempotency behavior in that feature specification.

Do not break a published v1 response shape without a migration plan. Add optional fields first where possible. A separate v2 is needed only for a genuinely incompatible public API contract.

## 12. External Integrations

Integrations are isolated behind services or provider adapters:

```text
src/integrations/
├── clerk/
├── gemini/
└── storage/
```

An adapter converts provider-specific request and response details into application-friendly types. Feature services depend on the adapter contract, not directly on provider SDK calls. Provider payloads, secret configuration, retries, and error translation stay inside the integration boundary.

For Phase 1, Clerk is the only planned integration. Gemini, file storage, and Socket.IO are deferred until their feature specifications are approved.

## 13. Testing Architecture

| Test type | Primary subject | Dependencies |
| --- | --- | --- |
| Unit | Mappers, validators, services | Mock repositories/adapters |
| Repository integration | Prisma repository methods | Isolated test database |
| HTTP integration | Routes, middleware, controllers | App instance; test database where necessary |

- `app.ts` must export an Express application without listening on a port, enabling Supertest.
- `server.ts` starts the server and owns graceful shutdown only.
- Tests must use a separate database URL and must never run migrations against development or production data.
- Test external services through adapters or mocks; never call live Gemini or Clerk services in ordinary test runs.

## 14. Naming and File Rules

| Item | Convention | Example |
| --- | --- | --- |
| Files | `kebab-case` with role suffix | `interview.service.ts` |
| Type/interface | `PascalCase` | `CreateInterviewInput` |
| Function | `camelCase`, verb-led | `createInterview` |
| Repository method | Persistence intent | `findOwnedById` |
| Route | plural kebab-case noun | `/api/v1/interviews` |
| Error code | uppercase snake case | `VALIDATION_ERROR` |
| Database enum | uppercase values | `IN_PROGRESS` |

Use named exports by default. Avoid barrel exports that hide circular dependencies. Keep shared utilities small and framework-neutral; do not turn `utils/` into an unowned dumping ground.

## 15. AI Implementation Prompt

```text
Read CLAUDE.md, all relevant docs/context documents, docs/backend/01-backend-setup.md,
and docs/backend/02-backend-architecture.md before changing code.

Use this architecture as a mandatory contract for all IntervueX backend work. Maintain
the dependency flow route → controller → service → repository → Prisma. Controllers
must be thin; services must not import Express; only repositories may access Prisma;
validators must not access the database. Use typed Zod DTOs, stable response mappers,
the shared API response/error envelopes, and authenticated local-user ownership checks.

Do not implement database models or feature modules as part of this architecture task.
If implementing a later approved feature, create only the files required by that feature
and keep its external integrations behind an adapter/service boundary. Run the relevant
format, lint, typecheck, and tests; update the progress tracker with completed work and
verification. Stop when the scoped work is complete.
```

## 16. Architecture Verification Checklist

- [ ] `01-backend-setup.md` is read and its foundation requirements remain intact.
- [ ] Every new backend feature can follow route → controller → service → repository → Prisma.
- [ ] Controllers do not import Prisma or contain ownership/business rules.
- [ ] Services do not import Express request or response types.
- [ ] Repositories are the sole Prisma-access layer.
- [ ] Authentication is handled in middleware; ownership is enforced by services.
- [ ] Request and response DTOs are separate from Prisma model shapes.
- [ ] Expected errors use the shared error code and response format.
- [ ] All feature endpoints can be mounted under `/api/v1`.
- [ ] Future external providers can be isolated behind an integration adapter.

## 17. Git Metadata and Next Step

| Item | Recommendation |
| --- | --- |
| Branch | `docs/backend-architecture` |
| Commit | `docs(backend): define layered architecture` |
| Pull request title | `docs(backend): define layered architecture` |

Next, create `docs/backend/03-database-design.md`. It will define the MVP data entities, fields, relations, indexes, ownership rules, and lifecycle states before any Prisma schema or migration is written.
