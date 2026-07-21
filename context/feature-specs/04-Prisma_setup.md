Read these files before making changes:

- CLAUDE.md
- project-overview.md
- architecture.md
- code-standards.md
- ai-workflow-rules.md
- progress-tracker.md
- 05-prisma_setup.md
- docs/backend/03-database-design.md
- docs/backend/04-prisma-schema.md

First verify the existing server foundation works:
- install dependencies
- run typecheck, lint, tests, and the health endpoint
- fix only foundation issues required for these checks

Then implement the Prisma and PostgreSQL setup.

Requirements:
- Use PostgreSQL and Prisma.
- Add the database connection through environment configuration; never commit credentials.
- Create the Prisma Client singleton.
- Create only these initial models:
  User, Interview, InterviewQuestion, Submission, Evaluation, Resume.
- Create only the approved enums from the Prisma schema rulebook.
- Generate and review the initial migration named init_core.
- Do not create interview APIs, Clerk middleware, user sync routes, mock data, seed data, Gemini, uploads, or frontend changes.
- Run Prisma validation, Prisma Client generation, typecheck, lint, tests, and verify the health endpoint.
- Update progress-tracker.md and 05-prisma_setup.md with changed files and verification results.
- Stop after completing this specification.