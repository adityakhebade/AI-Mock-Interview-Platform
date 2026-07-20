# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Backend Development — Database Layer Complete

## Current Goal

- Prisma ORM and PostgreSQL setup completed successfully
- Ready for Clerk authentication middleware and business logic implementation

## Completed

### Frontend Foundation

- Installed shadcn/ui runtime dependencies and `lucide-react`.
- Added `components.json` and `lib/utils.ts` with `cn()`.
- Configured Tailwind theme tokens for light and dark modes.
- Added reusable UI primitives under `components/ui/`.
- Wired theme management into the app shell.
- Refreshed the public landing page and implemented the final visual system.
- Added Reports, Resumes, and Settings pages.
- Fixed Tailwind v4 CSS compatibility issues in `app/globals.css`.
- Removed all mock/demo frontend data and replaced it with production empty states.
- Connected displayed user name, email, and avatar state to Clerk `useUser()`.
- Protected workspace routes with Clerk middleware.
- Replaced the PNG logo with a custom IntervueX SVG logo.
- Fixed the nested anchor hydration error in `AppShell`.
- Created and pushed the landing-page redesign branch and commits.

### Backend Foundation

- Created a standalone Express.js + TypeScript backend in `server/`.
- Configured strict TypeScript with an ES2022 target.
- Added environment configuration through `server/.env.example`.
- Configured ESLint and Prettier.
- Added the initial clean backend structure:

  ```text
  server/
  ├── src/
  │   ├── config/
  │   ├── controllers/
  │   ├── middleware/
  │   ├── repositories/
  │   ├── routes/
  │   ├── services/
  │   ├── sockets/
  │   ├── types/
  │   ├── utils/
  │   ├── validators/
  │   ├── app.ts
  │   └── server.ts
  └── package.json
  ```

- Added centralized error handling with `AppError`.
- Added a shared API response format.
- Added security middleware: Helmet, CORS, compression, and cookie parsing.
- Added HTTP request logging with Morgan.
- Added graceful shutdown handling.
- Added a health endpoint:

  ```text
  GET /api/v1/health
  ```

- Verified backend dependency installation, TypeScript compilation, linting, formatting, server startup, and health endpoint response.

### Prisma and PostgreSQL Setup

- **Installed Prisma Dependencies** (2026-07-20):
  - `prisma` v7.9.0 (dev dependency)
  - `@prisma/client` v7.9.0 (production dependency)

- **Initialized Prisma ORM**:
  - Generated `prisma/schema.prisma` with complete database schema
  - Created `prisma.config.ts` for Prisma 7 configuration
  - Created `prisma/README.md` with comprehensive setup documentation

- **Created Database Schema**:
  - Defined 6 enums: `InterviewStatus`, `InterviewDifficulty`, `QuestionType`, `QuestionStatus`, `SubmissionStatus`, `ResumeStatus`
  - Created 6 models: `User`, `Interview`, `InterviewQuestion`, `Submission`, `Evaluation`, `Resume`
  - Implemented all foreign key relationships and cascade delete behavior
  - Added all indexes for query optimization
  - Schema follows approved database design from `context/backend/03-DATABASE_DESIGN.md`

- **Configured Environment Variables**:
  - Added `DATABASE_URL` to `.env` and `.env.example`
  - PostgreSQL connection string format documented
  - Credentials properly excluded from version control

- **Created Prisma Client Singleton** (`src/config/prisma.ts`):
  - Singleton pattern for development hot reload
  - Configurable logging (verbose in dev, errors only in prod)
  - Ready for repository layer integration

- **Validation and Generation**:
  - ✓ Schema validation passes (`npx prisma validate`)
  - ✓ Prisma Client generated successfully
  - ✓ TypeScript compilation passes with Prisma types
  - ✓ ESLint passes (fixed line ending issues)
  - ✓ Server health check verified working

- **Migration Status**:
  - Migration `init_core` ready to be created
  - Pending PostgreSQL database connection
  - Migration will create all tables, enums, indexes, and relationships
  - Documentation provided for local and cloud PostgreSQL setup

- **Architecture Compliance**:
  - ✓ No business logic added (as per requirements)
  - ✓ No APIs created (as per requirements)
  - ✓ No Clerk middleware created (as per requirements)
  - ✓ No mock or seed data (as per requirements)
  - ✓ No frontend changes (as per requirements)
  - ✓ Database credentials never committed
  - ✓ Only approved models and enums implemented

### Backend Rulebooks

- Defined backend foundation requirements.
- Defined layered architecture rules:

  ```text
  Route → Controller → Service → Repository → Prisma → PostgreSQL
  ```

- Defined MVP database design for:
  - User
  - Interview
  - InterviewQuestion
  - Submission
  - Evaluation
  - Resume
- Defined Prisma schema, enums, relations, indexes, and migration strategy.
- Defined shared REST API conventions, error envelopes, ownership rules, and endpoint map.

## In Progress

- None. Prisma setup complete and verified.

## Next Up

### Immediate: Database Migration

- Set up PostgreSQL (local or cloud provider like Neon, Supabase, Railway)
- Create the `intervuex` database
- Run the initial migration: `npx prisma migrate dev --name init_core`
- Verify migration status and schema in database

### After Migration

1. **Clerk Authentication Middleware**: Verify JWT tokens and extract user identity
2. **User Synchronization Service**: Create/update local User records from Clerk webhooks
3. **Repository Layer**: Implement data access repositories for each model
4. **Interview Service**: Business logic for creating and managing interviews
5. **Question and Submission Management**: Handle interview flow and answer storage
6. **Evaluation and Reports**: Generate performance reports
7. **Resume Management**: Integrate Cloudinary for file uploads
8. **API Endpoints**: Build REST APIs for all features

## Open Questions

- PostgreSQL hosting: Local setup vs. cloud provider (Neon/Supabase/Railway) - needs user decision
- Production database URL and deployment environment configuration pending
- Resume file-storage provider (Cloudinary) integration will be configured when Resume module begins
- Gemini evaluation integration deferred until interview flow is working end to end

## Architecture Decisions

- Clerk remains the authentication provider and source of identity truth.
- The Express backend owns IntervueX application data and verifies Clerk identity for protected API routes.
- The Next.js frontend does not access Prisma or PostgreSQL directly.
- Controllers handle HTTP only.
- Services contain business logic, state transitions, and ownership checks.
- Repositories are the only layer allowed to access Prisma.
- Request validation uses Zod before controllers execute.
- All product routes are versioned under `/api/v1`.
- API responses use a common success/error envelope.
- Every user-owned resource must enforce ownership through the authenticated local user.
- PostgreSQL stores relational application data; resume files must not be stored directly in the database.
- No mock or demo data may be introduced into production UI or database setup.

## Session Notes

- Frontend UI and Clerk authentication are production-ready
- Backend Express.js foundation complete and verified
- **Prisma ORM setup complete** (2026-07-20):
  - Database schema created with all 6 models and 6 enums
  - Prisma Client singleton configured
  - Schema validation passing
  - TypeScript compilation working with Prisma types
  - Server health check verified
  - Migration `init_core` ready to execute
  - Comprehensive documentation created
- **Waiting for PostgreSQL**: Database connection needed to run migration
- Next meaningful unit: Set up PostgreSQL and run initial migration, then implement Clerk authentication middleware