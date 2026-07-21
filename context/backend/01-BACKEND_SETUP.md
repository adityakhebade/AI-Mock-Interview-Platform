# IntervueX Backend Foundation

**Status:** Approved foundation guide  
**Audience:** Contributors and AI coding agents  
**Scope:** Backend service setup only; no product modules or database models are implemented by this document.

## 1. Purpose

This document defines the foundation for the IntervueX backend: a standalone TypeScript and Express REST API that will persist application data, enforce server-side authorization, and provide a stable contract for the Next.js frontend.

Clerk remains the source of truth for authentication identities. The backend owns IntervueX application data such as interviews, questions, submissions, evaluations, reports, and resumes. PostgreSQL is accessed only through Prisma.

The foundation must make future feature work predictable: each request follows the same route → controller → service → repository → Prisma flow, and cross-cutting behavior such as validation, logging, errors, and security is configured once.

## 2. Goals

- Create an independently runnable Express + TypeScript backend service.
- Establish a clean, modular folder structure before product features are added.
- Provide safe configuration loading and fail fast when required environment values are missing.
- Standardize middleware, errors, API responses, logging, linting, formatting, and scripts.
- Prepare the service for PostgreSQL, Prisma, Clerk verification, and later Socket.IO without implementing those feature modules yet.
- Preserve a clear boundary: frontend UI never accesses Prisma or the database directly.

## 3. Responsibilities and Boundaries

### In scope

- HTTP server bootstrapping and health endpoint.
- Application middleware and global error handling.
- Environment configuration and typed configuration access.
- Shared response, error, and utility infrastructure.
- Development, build, lint, format, test, and Prisma scripts.
- Empty module directories with ownership rules.

### Explicitly out of scope

- Prisma models, migrations, or database business queries.
- Clerk user synchronization and protected feature endpoints.
- Interview, question, resume, evaluation, report, dashboard, or AI functionality.
- File uploads, external AI calls, email, queues, Socket.IO events, video, or code execution.
- Frontend changes beyond adding the backend base URL to its environment configuration when needed.

Do not add placeholder product routes, mock data, or speculative tables in this phase.

## 4. Technology Stack

| Technology | Role | Rationale |
| --- | --- | --- |
| Node.js (active LTS) | Runtime | Stable, well-supported runtime for the TypeScript service. |
| TypeScript | Language | Catches API and data-contract mistakes before runtime. |
| Express | HTTP framework | Lightweight, familiar, and suitable for an incremental REST API. |
| PostgreSQL | Primary database | Reliable relational storage for users, interviews, and reports. |
| Prisma | ORM and migrations | Type-safe database access and maintainable schema migrations. |
| Clerk | Identity provider | The existing frontend authentication provider; backend verifies Clerk-issued tokens. |
| Zod | Runtime validation | Validates environment values and later request DTOs with clear errors. |
| Pino + pino-http | Logging | Structured, machine-readable logs with low overhead. |
| Helmet | HTTP security headers | Establishes a secure default header baseline. |
| CORS | Browser-origin policy | Allows only configured frontend origins to access the API. |
| compression | Response compression | Reduces transfer size for suitable API responses. |
| Vitest + Supertest | Testing | Fast TypeScript-compatible unit and HTTP integration tests. |
| ESLint + Prettier | Code quality | Enforces consistent code and catches common mistakes. |

`morgan` is not required when Pino HTTP logging is used. Use one request logger, not both.

## 5. Service Layout

Create the backend as a separate service at `backend/`. The exact project may call this directory `server/`; choose one name once and use it consistently. This document uses `backend/`.

```text
backend/
├── prisma/
│   ├── schema.prisma              # Added in the Prisma phase
│   ├── migrations/                # Generated migrations; never hand-edit applied migrations
│   └── seed.ts                    # Seed entry point only when seeds are approved
├── src/
│   ├── config/
│   │   ├── env.ts                 # Zod-validated environment configuration
│   │   └── logger.ts              # Pino logger setup
│   ├── constants/                 # Shared constants with no business logic
│   ├── controllers/               # Translate HTTP requests/responses; no Prisma calls
│   ├── errors/                    # AppError and error classification helpers
│   ├── middleware/                # Auth, validation, 404, error, and request middleware
│   ├── repositories/              # The only layer that will access Prisma
│   ├── routes/                    # Route registration and endpoint-to-controller mapping
│   ├── services/                  # Business rules and transaction orchestration
│   ├── types/                     # Shared TypeScript types and Express augmentation
│   ├── utils/                     # Stateless, framework-neutral helpers
│   ├── validators/                # Zod request schemas and DTO definitions
│   ├── prisma/                    # Prisma client singleton, added in Prisma phase
│   ├── app.ts                     # Creates and configures the Express application
│   └── server.ts                  # Starts HTTP server and handles graceful shutdown
├── tests/
│   ├── unit/
│   ├── integration/
│   └── helpers/
├── .env.example                   # Safe, documented environment variable template
├── .gitignore
├── eslint.config.*
├── prettier.config.*
├── package.json
└── tsconfig.json
```

### Layer ownership rules

| Layer | Owns | Must not do |
| --- | --- | --- |
| Routes | URL, HTTP method, middleware order | Business rules or database access |
| Controllers | Request extraction and response selection | Prisma calls or complex business logic |
| Services | Business rules, ownership checks, transactions | Express `Request`/`Response` usage |
| Repositories | Prisma queries and persistence mapping | HTTP concerns or policy decisions |
| Validators | Parsing and validation of untrusted input | Database queries |
| Middleware | Cross-cutting HTTP concerns | Feature-specific business logic |

Dependencies flow inward: `routes → controllers → services → repositories → Prisma`. Reverse imports are prohibited.

## 6. Environment Configuration

Keep secrets in `backend/.env`, never in source control. Commit `backend/.env.example` with blank values and comments only. Validate configuration once at startup using Zod; application code imports the typed config object rather than reading `process.env` directly.

```dotenv
# Runtime
NODE_ENV=development
PORT=4000
LOG_LEVEL=info

# Browser access
FRONTEND_URL=http://localhost:3000

# Database (introduced in the Prisma phase)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/intervuex?schema=public

# Clerk (introduced in the authentication phase)
CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=

# Optional, added only with the corresponding feature
# GEMINI_API_KEY=
# STORAGE_*=
```

Required now: `NODE_ENV`, `PORT`, `LOG_LEVEL`, and `FRONTEND_URL`. `DATABASE_URL` becomes required when Prisma is configured. Clerk keys become required only when backend authentication middleware is introduced. Do not introduce a separate JWT secret: Clerk is the authentication authority for this MVP.

## 7. Package Selection

Install only the packages needed for the foundation.

```text
Runtime:     express, cors, helmet, compression, dotenv, zod, pino, pino-http
Development: typescript, tsx, @types/node, @types/express, @types/cors,
             @types/compression, eslint, prettier, vitest, supertest,
             @types/supertest
Later:       prisma, @prisma/client, @clerk/express (or the current official Clerk server SDK)
```

Before adding Clerk or Prisma packages, confirm their current official setup in their primary documentation and record the chosen versions in the relevant setup document. Do not add `jsonwebtoken`, `passport`, ORM alternatives, or a dependency-injection framework without an approved architecture decision.

## 8. NPM Scripts

The backend `package.json` must provide these scripts. Adjust command syntax only where the project tooling requires it.

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/server.js",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest run",
    "test:watch": "vitest",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  }
}
```

Prisma scripts may exist before Prisma is installed, but must not be run until the Prisma setup phase is complete.

## 9. Request Lifecycle and Middleware Order

```text
Client
  → request ID and structured request log
  → Helmet
  → configured CORS
  → compression
  → express.json / URL-encoded parser with size limits
  → public health route
  → API router (/api/v1)
      → authentication middleware (protected routes only)
      → request validation
      → controller
      → service
      → repository
      → Prisma / PostgreSQL
  → not-found middleware
  → central error handler
  → consistent JSON response and completion log
```

Register the error handler last. The health endpoint must be public and return a minimal response such as `{ "success": true, "data": { "status": "ok" } }`. API feature routes will be introduced under `/api/v1` to permit future non-breaking versioning.

## 10. Coding and API Conventions

- Use strict TypeScript. Do not use `any`; prefer `unknown` plus narrowing.
- Use `camelCase` for variables/functions, `PascalCase` for types/classes, and `kebab-case` for file names.
- Name files by responsibility: `interview.controller.ts`, `interview.service.ts`, `interview.repository.ts`, `interview.validator.ts`.
- Use async/await. Do not leave rejected promises unhandled.
- Use `AppError` subclasses or typed error codes for expected failures. Never expose stack traces or internal error details to clients.
- Validate path parameters, query parameters, and request bodies at the API boundary with Zod.
- Return a consistent envelope, for example:

```json
{ "success": true, "data": {}, "meta": {} }
```

```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Invalid request", "details": [] } }
```

- Keep controllers thin and repositories deterministic. Services enforce ownership and business state transitions.
- Do not return raw Prisma records when a dedicated response DTO is needed; map fields explicitly in the service or response mapper.

## 11. Configuration, Logging, and Security Baseline

### Configuration strategy

`config/env.ts` is the only module permitted to parse environment values. It validates, coerces, and exports an immutable typed configuration object. Test configuration separately; tests must not depend on a developer's local `.env` file.

### Logging overview

Use Pino structured logs. Each request receives or accepts a request ID, which appears in request, error, and service logs. Log method, route, status, duration, and request ID. Never log passwords, Clerk tokens, authorization headers, database URLs, raw resumes, code submissions, or AI prompts/responses containing candidate data.

### Security baseline

- Enable Helmet with reviewed defaults.
- Restrict CORS to `FRONTEND_URL`; do not use `*` with credentials.
- Set JSON/body size limits before routes.
- Trust reverse proxies only when deployment configuration requires it.
- Store secrets outside Git; rotate exposed credentials immediately.
- Verify Clerk tokens server-side before any protected-route data access.
- Enforce ownership in services even when a route is authenticated.
- Add rate limiting when public/auth-sensitive endpoints are introduced; document the policy then.

## 12. Development Workflow

For every implementation unit:

1. Read `CLAUDE.md` and all relevant documents in `docs/context/`, then this document.
2. Read the matching document in `docs/backend/` and implementation spec in `docs/specs/` when available.
3. Inspect the current codebase and preserve unrelated work.
4. Implement only the approved scope; do not add adjacent features.
5. Run the relevant verification commands: format check, lint, typecheck, tests, and startup/health check.
6. Update the progress tracker with completed work, verification performed, and any decision or blocker.
7. Commit a small, coherent change and open a focused pull request.

If a context file conflicts with an approved backend design document, stop and document the discrepancy rather than silently choosing one.

## 13. AI Implementation Prompt

```text
You are implementing the IntervueX backend foundation.

First read CLAUDE.md, all relevant docs/context/*.md files, the project progress tracker,
and docs/backend/01-backend-setup.md. Treat the backend setup document as the
implementation contract.

Create the backend/ TypeScript + Express foundation exactly as documented: project
structure, strict TypeScript configuration, typed Zod-validated environment config,
Pino request logging, Helmet, restricted CORS, compression, JSON body limits, a public
health endpoint, not-found middleware, central error handling, linting/formatting,
testing scaffolding, and npm scripts.

Do not implement Prisma models, database access, Clerk synchronization, feature routes,
mock data, AI integrations, Socket.IO, uploads, or frontend changes beyond essential
configuration documentation. Controllers must not access Prisma; future layering must
remain route → controller → service → repository → Prisma.

Run format checking, linting, type checking, tests, and a local health-endpoint check.
Report every changed file, command result, and assumption. Update the progress tracker
only after verification. Stop when the foundation is complete.
```

## 14. Verification Checklist

- [ ] `backend/` follows the documented structure.
- [ ] `npm run dev` starts the service and `GET /health` returns HTTP 200.
- [ ] Invalid or missing required environment variables stop startup with actionable messages.
- [ ] CORS accepts only the configured frontend origin.
- [ ] Helmet, compression, parsers, request logging, 404, and error middleware run in the documented order.
- [ ] Unexpected errors return the standard error envelope without a stack trace.
- [ ] `npm run format:check`, `npm run lint`, `npm run typecheck`, and `npm test` pass.
- [ ] `.env` is ignored and `.env.example` contains no real secret.
- [ ] No product module, mock data, Prisma schema/model, or database query has been added.
- [ ] The progress tracker records the implementation and verification results.

## 15. Recommended Git Metadata

| Item | Recommendation |
| --- | --- |
| Branch | `feat/backend-foundation` |
| Commit | `feat(backend): establish Express service foundation` |
| Pull request title | `feat(backend): establish Express service foundation` |
| PR description | Summarize configuration, middleware, tooling, verification output, and explicitly note that no business modules were introduced. |

## 16. Related Context and Next Document

Read and keep this document aligned with the existing project context documents, especially:

- `CLAUDE.md` — AI-agent entry point and repository-specific instructions.
- `docs/context/project-overview.md` — product scope and MVP boundaries.
- `docs/context/architecture.md` — existing frontend and layered-architecture decisions.
- `docs/context/coding-standards.md` — naming, quality, and API conventions.
- `docs/context/ai-workflow-rules.md` — incremental AI development rules.
- `docs/context/progress-tracker.md` — current work state and completed decisions.
- `README.md` — public project summary and developer onboarding.

If a listed file is not present in the current checkout, do not invent its content; use the available context and record the missing reference in the progress tracker.

After this foundation is implemented and verified, create and approve `docs/backend/02-backend-architecture.md`. That document will define module boundaries, DTOs, transaction rules, repository patterns, and the precise dependency rules used by feature modules.
