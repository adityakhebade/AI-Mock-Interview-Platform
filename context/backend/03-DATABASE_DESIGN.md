# IntervueX MVP Database Design

**Status:** Design specification  
**Prerequisites:** `01-backend-setup.md`, `02-backend-architecture.md`  
**Scope:** MVP Phase 1 data model. This document defines the data before any Prisma schema or migration is created.

## 1. Purpose

This document defines the minimum relational data model needed for a user to create an interview, complete it, receive a report, and manage uploaded resumes.

The model deliberately avoids features that are not required for the MVP: recruiters, organizations, schedules, payments, live collaboration, video recordings, notifications, leaderboards, cheating detection, and an AI question library. Those can be added later without weakening the MVP foundation.

## 2. Design Principles

- Clerk handles authentication; the local `User` record owns IntervueX application data.
- Every user-owned record is reachable through a `userId` ownership path.
- UUIDs are used as primary keys and are never derived from user-provided values.
- Keep structured, queryable data in columns; keep flexible AI-produced content in JSON only when its shape is intentionally variable.
- Store state explicitly with enums rather than inferring it from nullable fields.
- Use timestamps in UTC and expose them as ISO-8601 values through API DTOs.
- Build for one candidate per interview in Phase 1. Multi-user/live interviews are out of scope.

## 3. Entity Relationship Diagram

```text
User
 ├──< Interview
 │     ├──< InterviewQuestion
 │     │     └──< Submission
 │     └─── Evaluation
 └──< Resume
```

Relationship summary:

| Parent | Child | Cardinality | Rule |
| --- | --- | --- | --- |
| User | Interview | One to many | An interview belongs to exactly one user. |
| Interview | InterviewQuestion | One to many | Questions are ordered within one interview. |
| InterviewQuestion | Submission | One to many | A question can have saved drafts and final attempts. |
| Interview | Evaluation | One to zero/one | An interview receives at most one MVP evaluation. |
| User | Resume | One to many | A user can upload and retain multiple resumes. |

## 4. Enums

These values are stable API/domain concepts and should be Prisma enums in the next phase.

| Enum | Values | Purpose |
| --- | --- | --- |
| `InterviewStatus` | `DRAFT`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED` | Interview lifecycle. |
| `InterviewDifficulty` | `EASY`, `MEDIUM`, `HARD` | Requested session difficulty. |
| `QuestionType` | `CODING`, `BEHAVIORAL`, `TECHNICAL` | Question interaction and evaluation type. |
| `QuestionStatus` | `PENDING`, `ACTIVE`, `ANSWERED`, `SKIPPED` | Progress of a question during an interview. |
| `SubmissionStatus` | `DRAFT`, `FINAL` | Whether a saved response is still editable. |
| `ResumeStatus` | `UPLOADED`, `ANALYZED`, `FAILED` | Upload/analysis state; AI analysis comes later. |

Do not add `SCHEDULED` until interview scheduling exists. Do not add provider-specific statuses to business enums.

## 5. Tables

### 5.1 User

The local user record connects a Clerk identity to application-owned data. It is not a replacement for Clerk and must not store passwords or session tokens.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | UUID | primary key | Internal IntervueX user ID. |
| `clerkId` | string | unique, required | Clerk subject identifier. |
| `email` | string | required | Last known primary email for display/contact. |
| `displayName` | string | nullable | Candidate name; may be absent initially. |
| `imageUrl` | string | nullable | Clerk-hosted profile image URL. |
| `createdAt` | timestamp | required | Default current time. |
| `updatedAt` | timestamp | required | Automatically updated. |

Indexes: unique index on `clerkId`; index on `email` only if user lookup by email is required later. Do not make email the identity key because it can change.

### 5.2 Interview

An interview is a candidate’s configured and completed mock-interview session.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | UUID | primary key | Interview identifier. |
| `userId` | UUID | required, foreign key | Owner of the interview. |
| `role` | string | required | Target role, e.g. Frontend Developer. |
| `difficulty` | enum | required | `InterviewDifficulty`. |
| `durationMinutes` | integer | required, positive | Requested duration, not elapsed time. |
| `language` | string | nullable | Programming language for coding sessions. |
| `status` | enum | required | `InterviewStatus`, default `DRAFT`. |
| `startedAt` | timestamp | nullable | Set once when session begins. |
| `endedAt` | timestamp | nullable | Set when completed/cancelled. |
| `createdAt` | timestamp | required | Default current time. |
| `updatedAt` | timestamp | required | Automatically updated. |

Indexes: `(userId, createdAt)` supports a user's interview history; `(userId, status)` supports dashboard counts and filtered lists.

Lifecycle rules:

```text
DRAFT → IN_PROGRESS → COMPLETED
  └─────────────────→ CANCELLED
IN_PROGRESS → CANCELLED
```

Only the owner can transition the interview. A completed or cancelled interview is immutable except for non-destructive internal processing that is explicitly documented.

### 5.3 InterviewQuestion

This table stores the exact questions attached to an interview. Keeping them per interview preserves the candidate’s historical session even if a future question library changes.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | UUID | primary key | Question instance identifier. |
| `interviewId` | UUID | required, foreign key | Parent interview. |
| `prompt` | text | required | Question shown to the candidate. |
| `type` | enum | required | `QuestionType`. |
| `difficulty` | enum | required | `InterviewDifficulty`. |
| `expectedAnswer` | text | nullable | Private rubric or expected response; never return by default. |
| `evaluationCriteria` | JSON | nullable | Flexible rubric structure for later AI evaluation. |
| `position` | integer | required | Zero- or one-based order; choose one convention and document it in the feature spec. |
| `status` | enum | required | `QuestionStatus`, default `PENDING`. |
| `createdAt` | timestamp | required | Default current time. |
| `updatedAt` | timestamp | required | Automatically updated. |

Constraints and indexes: unique `(interviewId, position)` prevents duplicate ordering; index `interviewId` supports loading questions for a session.

### 5.4 Submission

A submission records a candidate’s saved code or textual answer for a single interview question. Multiple rows allow optional autosave history, while the current/final answer is identifiable by status and timestamp.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | UUID | primary key | Submission identifier. |
| `questionId` | UUID | required, foreign key | Answered interview question. |
| `content` | text | required | Code or text response. |
| `language` | string | nullable | Language selected for code. |
| `status` | enum | required | `SubmissionStatus`, default `DRAFT`. |
| `submittedAt` | timestamp | nullable | Set for final submission. |
| `createdAt` | timestamp | required | Default current time. |
| `updatedAt` | timestamp | required | Automatically updated. |

Index `questionId, updatedAt` supports loading the latest saved work. The Phase 1 feature spec must define whether autosave updates one draft record or writes a history record. Default MVP choice: update one draft, then create or mark a final record when the candidate submits.

### 5.5 Evaluation

An evaluation is the single generated performance result for a completed interview. It is stored separately so it can be generated asynchronously and shown as a report without reprocessing the interview.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | UUID | primary key | Evaluation identifier. |
| `interviewId` | UUID | unique, required, foreign key | One evaluation per interview. |
| `overallScore` | decimal | nullable | 0–100 score; null until evaluation is complete. |
| `codingScore` | decimal | nullable | 0–100 score. |
| `communicationScore` | decimal | nullable | 0–100 score. |
| `problemSolvingScore` | decimal | nullable | 0–100 score. |
| `feedback` | text | nullable | Overall feedback. |
| `strengths` | JSON | nullable | Array of structured or textual strengths. |
| `improvements` | JSON | nullable | Array of structured improvement suggestions. |
| `rawProviderResult` | JSON | nullable | Private provider output for debugging; never return directly. |
| `generatedAt` | timestamp | nullable | Set after successful generation. |
| `createdAt` | timestamp | required | Default current time. |
| `updatedAt` | timestamp | required | Automatically updated. |

`rawProviderResult` must be access-controlled and should be retained only if it is useful for debugging and permitted by the privacy policy. It is optional for the MVP and should not delay report delivery.

### 5.6 Resume

This table stores resume metadata, not file bytes. Store files in an approved object-storage provider later and persist only a provider key or URL.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | UUID | primary key | Resume identifier. |
| `userId` | UUID | required, foreign key | Resume owner. |
| `fileName` | string | required | Original display file name. |
| `storageKey` | string | unique, required | Private object-storage identifier. |
| `mimeType` | string | required | Allowlisted content type. |
| `fileSizeBytes` | integer | required | Used to enforce upload limit. |
| `status` | enum | required | `ResumeStatus`, default `UPLOADED`. |
| `atsScore` | decimal | nullable | Added when analysis is implemented. |
| `analysis` | JSON | nullable | Structured analysis output, never raw file contents. |
| `createdAt` | timestamp | required | Upload timestamp. |
| `updatedAt` | timestamp | required | Automatically updated. |

Indexes: `(userId, createdAt)` supports resume history; unique `storageKey` prevents a metadata collision. A signed download URL should be generated by a service, never stored as a permanent public URL.

## 6. Referential Actions and Deletion Policy

Phase 1 should avoid user self-deletion until its privacy workflow is designed. Therefore, no feature should expose destructive user deletion.

Recommended database behavior:

- Deleting an `Interview` cascades to its questions, submissions, and evaluation only if a later user-facing delete feature is explicitly approved.
- Deleting a `User` cascades to user-owned records only as part of a controlled account-deletion workflow that also removes object-storage files.
- Deleting a `Resume` must first delete its object-storage file through a service workflow; do not rely solely on database cascade behavior.

Until those workflows exist, prefer soft product actions such as `CANCELLED` over deletes for interviews.

## 7. Ownership and Access Rules

| Resource | Ownership check |
| --- | --- |
| User | Local user is resolved from authenticated Clerk subject. |
| Interview | `interview.userId` equals authenticated local user ID. |
| Question | Parent interview belongs to authenticated user. |
| Submission | Parent question’s interview belongs to authenticated user. |
| Evaluation | Parent interview belongs to authenticated user. |
| Resume | `resume.userId` equals authenticated local user ID. |

Repositories may support efficient ownership-aware queries, but services must ensure every access path applies the rule. Do not expose sequential IDs or return internal rubric/provider fields to the candidate by default.

## 8. Data Not Stored in the MVP

- Clerk passwords, session tokens, or authentication secrets.
- Video, audio, screen recordings, or raw webcam streams.
- Resume file bytes in PostgreSQL.
- Full client telemetry or keystroke histories.
- A global reusable question bank.
- Team, company, recruiter, calendar, billing, or notification data.

## 9. Migration Strategy

1. Finalize this document before changing `prisma/schema.prisma`.
2. Create the initial schema in `04-prisma-schema.md`.
3. Use `prisma migrate dev --name init_core` only against a development database.
4. Commit `schema.prisma` and generated migration files together.
5. Never edit a migration after it has been applied outside a local disposable database; create a new migration instead.
6. Use a separate database for automated tests and never point tests at production.

## 10. AI Implementation Prompt

```text
Read CLAUDE.md, relevant docs/context files, docs/backend/01-backend-setup.md,
docs/backend/02-backend-architecture.md, and docs/backend/03-database-design.md.

Do not create Prisma models, migrations, or feature code yet. Review this MVP data
design for conflicts with the existing frontend and scope. Confirm that every user-owned
record has an ownership path, lifecycle states are intentional, and no out-of-scope
features have been introduced.

If you find a required data-model ambiguity, report it with options and do not silently
invent fields. Otherwise, prepare to use this document as the sole data-design input for
docs/backend/04-prisma-schema.md. Update the progress tracker only if a documented
decision is made.
```

## 11. Approval Checklist

- [ ] The MVP journey can be represented: user → interview → questions/submissions → evaluation/report.
- [ ] Resume metadata is stored without storing file bytes in PostgreSQL.
- [ ] Every user-owned table has a direct or transitive ownership path.
- [ ] Every relation, enum, index, and lifecycle state is justified.
- [ ] Advanced/non-MVP entities are intentionally excluded.
- [ ] Deletion and object-storage considerations are documented.
- [ ] The model is approved before Prisma schema creation begins.

## 12. Git Metadata and Next Step

| Item | Recommendation |
| --- | --- |
| Branch | `docs/database-design` |
| Commit | `docs(backend): define MVP database design` |
| Pull request title | `docs(backend): define MVP database design` |

Next, create `docs/backend/04-prisma-schema.md`. It will translate this approved design into exact Prisma models, enums, relations, and migration instructions. After that, the remaining essential rulebooks are `05-authentication.md` and `06-api-design.md`; then development can move to feature specifications.
