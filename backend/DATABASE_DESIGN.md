# IntervueX Database Design

## Overview

This document defines the complete database structure for IntervueX. It serves as the authoritative specification before Prisma schema implementation.

**Database**: PostgreSQL  
**ORM**: Prisma  
**Connection**: Neon Serverless PostgreSQL

---

## Design Principles

1. **User Ownership**: Every resource is owned by a User
2. **Referential Integrity**: All foreign keys enforce relationships
3. **Cascade Deletes**: Deleting a User removes all owned resources
4. **Audit Timestamps**: Every table includes `createdAt` and `updatedAt`
5. **Enum Types**: Status and type fields use database enums
6. **Unique Constraints**: Prevent duplicate records where appropriate
7. **Indexes**: Optimize common query patterns
8. **Nullability**: Only nullable when business logic requires it

---

## Tables

1. **Users** - Application users synced from Clerk
2. **Resumes** - Uploaded resume files with metadata
3. **Interviews** - Interview session records
4. **Questions** - Interview questions
5. **Submissions** - Candidate answers to questions
6. **Evaluations** - AI-generated evaluation results
7. **Reports** - Final interview reports

---

## Table Specifications

### 1. Users

**Purpose**: Store application users synchronized from Clerk authentication.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String (CUID) | PRIMARY KEY | Unique user identifier |
| `clerkId` | String | UNIQUE, NOT NULL | Clerk user ID |
| `name` | String | NOT NULL | User's full name |
| `email` | String | UNIQUE, NOT NULL | User's email address |
| `imageUrl` | String | NULLABLE | Profile image URL from Clerk |
| `createdAt` | DateTime | NOT NULL, DEFAULT now() | Account creation timestamp |
| `updatedAt` | DateTime | NOT NULL, AUTO-UPDATE | Last update timestamp |

**Relationships**:
- One User → Many Resumes
- One User → Many Interviews
- One User → Many Reports

**Indexes**:
- `clerkId` (unique, for authentication lookups)
- `email` (unique, for user lookups)

**Business Rules**:
- `clerkId` must be unique across all users
- `email` must be unique and valid format
- Users are created lazily when first authenticated
- Deleting a User cascades to all owned resources

---

### 2. Resumes

**Purpose**: Store metadata for uploaded resume files.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String (CUID) | PRIMARY KEY | Unique resume identifier |
| `userId` | String (CUID) | FOREIGN KEY → Users.id, NOT NULL | Owner of the resume |
| `fileName` | String | NOT NULL | Original file name |
| `fileUrl` | String | NOT NULL | Cloudinary URL to file |
| `publicId` | String | NOT NULL | Cloudinary public ID for deletion |
| `fileSize` | Integer | NOT NULL | File size in bytes |
| `createdAt` | DateTime | NOT NULL, DEFAULT now() | Upload timestamp |
| `updatedAt` | DateTime | NOT NULL, AUTO-UPDATE | Last update timestamp |

**Relationships**:
- Many Resumes → One User
- One Resume → Many Interviews (via `resumeId` in Interviews)

**Indexes**:
- `userId` (for user's resume queries)
- `publicId` (for Cloudinary operations)

**Business Rules**:
- Resume files are stored in Cloudinary, not PostgreSQL
- Only metadata is stored in the database
- A user can have multiple resumes
- Resumes can be deleted independently
- Deleting a User cascades to all Resumes

---

### 3. Interviews

**Purpose**: Store interview session records.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String (CUID) | PRIMARY KEY | Unique interview identifier |
| `userId` | String (CUID) | FOREIGN KEY → Users.id, NOT NULL | Owner of the interview |
| `resumeId` | String (CUID) | FOREIGN KEY → Resumes.id, NULLABLE | Associated resume (optional) |
| `title` | String | NOT NULL | Interview title |
| `role` | String | NOT NULL | Job role being interviewed for |
| `difficulty` | Enum (Difficulty) | NOT NULL | Interview difficulty level |
| `language` | String | NOT NULL | Programming language or spoken language |
| `duration` | Integer | NOT NULL | Expected duration in minutes |
| `status` | Enum (InterviewStatus) | NOT NULL, DEFAULT 'DRAFT' | Current interview status |
| `startedAt` | DateTime | NULLABLE | Timestamp when interview started |
| `completedAt` | DateTime | NULLABLE | Timestamp when interview completed |
| `createdAt` | DateTime | NOT NULL, DEFAULT now() | Creation timestamp |
| `updatedAt` | DateTime | NOT NULL, AUTO-UPDATE | Last update timestamp |

**Relationships**:
- Many Interviews → One User
- Many Interviews → One Resume (optional)
- One Interview → Many Questions
- One Interview → Many Submissions
- One Interview → One Evaluation (optional)
- One Interview → One Report (optional)

**Indexes**:
- `userId` (for user's interview queries)
- `status` (for filtering by status)
- `userId, status` (composite for user's active interviews)

**Business Rules**:
- `resumeId` is optional (user may interview without uploading resume)
- `startedAt` is set when status changes to `IN_PROGRESS`
- `completedAt` is set when status changes to `COMPLETED`
- Status transitions: `DRAFT` → `IN_PROGRESS` → `COMPLETED` or `CANCELLED`
- Deleting a User cascades to all Interviews
- Deleting an Interview cascades to Questions, Submissions, Evaluation, Report

---

### 4. Questions

**Purpose**: Store interview questions.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String (CUID) | PRIMARY KEY | Unique question identifier |
| `interviewId` | String (CUID) | FOREIGN KEY → Interviews.id, NOT NULL | Parent interview |
| `question` | Text | NOT NULL | Question text |
| `type` | Enum (QuestionType) | NOT NULL | Type of question |
| `difficulty` | Enum (Difficulty) | NOT NULL | Question difficulty |
| `order` | Integer | NOT NULL | Display order in interview |
| `createdAt` | DateTime | NOT NULL, DEFAULT now() | Creation timestamp |

**Relationships**:
- Many Questions → One Interview
- One Question → Many Submissions

**Indexes**:
- `interviewId` (for fetching interview questions)
- `interviewId, order` (composite for ordered retrieval)

**Business Rules**:
- Questions belong to exactly one Interview
- `order` must be unique within an Interview
- Question order starts at 1
- Deleting an Interview cascades to all Questions
- Questions are created when Interview is initialized

---

### 5. Submissions

**Purpose**: Store candidate answers to interview questions.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String (CUID) | PRIMARY KEY | Unique submission identifier |
| `interviewId` | String (CUID) | FOREIGN KEY → Interviews.id, NOT NULL | Parent interview |
| `questionId` | String (CUID) | FOREIGN KEY → Questions.id, NOT NULL | Question being answered |
| `answer` | Text | NULLABLE | Text answer |
| `code` | Text | NULLABLE | Code answer (for coding questions) |
| `language` | String | NULLABLE | Programming language for code |
| `createdAt` | DateTime | NOT NULL, DEFAULT now() | Initial submission timestamp |

**Relationships**:
- Many Submissions → One Interview
- Many Submissions → One Question
- One Submission per Question per Interview (unique constraint)

**Indexes**:
- `interviewId` (for fetching all submissions)
- `questionId` (for question-specific lookups)
- `interviewId, questionId` (composite unique constraint)

**Business Rules**:
- Each question can have only one submission per interview
- Either `answer` or `code` must be provided (at least one non-null)
- `language` is required if `code` is provided
- Submissions are auto-saved as user types
- Deleting an Interview cascades to all Submissions

---

### 6. Evaluations

**Purpose**: Store AI-generated evaluation of interview performance.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String (CUID) | PRIMARY KEY | Unique evaluation identifier |
| `interviewId` | String (CUID) | FOREIGN KEY → Interviews.id, UNIQUE, NOT NULL | Interview being evaluated |
| `score` | Integer | NOT NULL | Overall score (0-100) |
| `strengths` | Text | NOT NULL | Identified strengths |
| `weaknesses` | Text | NOT NULL | Areas for improvement |
| `feedback` | Text | NOT NULL | Detailed feedback |
| `createdAt` | DateTime | NOT NULL, DEFAULT now() | Evaluation timestamp |

**Relationships**:
- One Evaluation → One Interview (1:1 relationship)

**Indexes**:
- `interviewId` (unique, for fetching evaluation)

**Business Rules**:
- Each Interview can have only one Evaluation
- Evaluation is created when Interview status becomes `COMPLETED`
- `score` must be between 0 and 100
- Deleting an Interview cascades to its Evaluation

---

### 7. Reports

**Purpose**: Store final interview reports for user review.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String (CUID) | PRIMARY KEY | Unique report identifier |
| `userId` | String (CUID) | FOREIGN KEY → Users.id, NOT NULL | Report owner |
| `interviewId` | String (CUID) | FOREIGN KEY → Interviews.id, UNIQUE, NOT NULL | Associated interview |
| `overallScore` | Integer | NOT NULL | Overall performance score (0-100) |
| `recommendation` | Text | NOT NULL | AI recommendation |
| `summary` | Text | NOT NULL | Interview summary |
| `createdAt` | DateTime | NOT NULL, DEFAULT now() | Report generation timestamp |

**Relationships**:
- Many Reports → One User
- One Report → One Interview (1:1 relationship)

**Indexes**:
- `userId` (for user's report history)
- `interviewId` (unique, for interview report lookup)
- `userId, createdAt` (composite for sorted report history)

**Business Rules**:
- Each Interview has exactly one Report
- Report is generated after Evaluation completes
- `overallScore` must be between 0 and 100
- Reports are read-only after creation
- Deleting a User cascades to all Reports
- Deleting an Interview cascades to its Report

---

## Enums

### InterviewStatus

Represents the current state of an interview.

**Values**:
- `DRAFT` - Interview created but not started
- `IN_PROGRESS` - Interview is actively running
- `COMPLETED` - Interview finished successfully
- `CANCELLED` - Interview was cancelled

**Transitions**:
- `DRAFT` → `IN_PROGRESS` (user starts interview)
- `IN_PROGRESS` → `COMPLETED` (user submits all answers)
- `IN_PROGRESS` → `CANCELLED` (user cancels)
- `DRAFT` → `CANCELLED` (user cancels before starting)

**Business Rules**:
- Cannot transition from `COMPLETED` or `CANCELLED`
- `startedAt` is set on `DRAFT` → `IN_PROGRESS`
- `completedAt` is set on `IN_PROGRESS` → `COMPLETED`

---

### Difficulty

Represents difficulty level for interviews and questions.

**Values**:
- `EASY` - Beginner level
- `MEDIUM` - Intermediate level
- `HARD` - Advanced level

**Usage**:
- Applied to Interviews (overall difficulty)
- Applied to Questions (individual question difficulty)

---

### QuestionType

Represents the type of interview question.

**Values**:
- `MCQ` - Multiple choice question
- `TECHNICAL` - Technical theory question
- `CODING` - Programming challenge
- `HR` - Behavioral/HR question
- `BEHAVIORAL` - Situational question

**Business Rules**:
- `CODING` type questions may have `code` and `language` in Submissions
- Other types typically use text `answer` only

---

## Relationships Summary

```
User
  ├── Resumes (1:N)
  ├── Interviews (1:N)
  │     ├── Questions (1:N)
  │     ├── Submissions (1:N)
  │     ├── Evaluation (1:1)
  │     └── Report (1:1)
  └── Reports (1:N)
```

---

## Cascade Rules

### On User Delete

Cascades to:
- All Resumes (and Cloudinary files deleted via service)
- All Interviews
  - All Questions
  - All Submissions
  - Evaluation
  - Report

**Rationale**: User owns all their data; deleting user removes entire account.

---

### On Interview Delete

Cascades to:
- All Questions
- All Submissions
- Evaluation
- Report

**Rationale**: Interview is the parent entity; children cannot exist without it.

---

### On Resume Delete

Does NOT cascade to Interviews.

**Rationale**: Interview may reference resume, but deletion shouldn't affect historical interview records. `resumeId` becomes NULL.

---

### On Question Delete

Does NOT cascade to Submissions.

**Rationale**: Typically Questions are not deleted individually. If needed, Submissions should be handled explicitly.

---

## Indexes Strategy

### Primary Indexes (Unique Constraints)

- `Users.id` - Primary key
- `Users.clerkId` - Authentication lookup
- `Users.email` - User identification
- `Resumes.id` - Primary key
- `Interviews.id` - Primary key
- `Questions.id` - Primary key
- `Submissions.id` - Primary key
- `Evaluations.id` - Primary key
- `Evaluations.interviewId` - 1:1 relationship
- `Reports.id` - Primary key
- `Reports.interviewId` - 1:1 relationship

### Foreign Key Indexes

- `Resumes.userId` - User's resumes lookup
- `Interviews.userId` - User's interviews lookup
- `Interviews.resumeId` - Resume usage tracking
- `Questions.interviewId` - Interview questions fetch
- `Submissions.interviewId` - Interview submissions fetch
- `Submissions.questionId` - Question-specific lookups
- `Reports.userId` - User's report history

### Composite Indexes

- `Interviews(userId, status)` - Filter user's active/completed interviews
- `Questions(interviewId, order)` - Ordered question retrieval
- `Submissions(interviewId, questionId)` - Unique constraint + fast lookup
- `Reports(userId, createdAt)` - Sorted report history

---

## Validation Rules

### User Constraints

- `clerkId` must be unique
- `email` must be unique and valid email format
- `name` must not be empty

### Resume Constraints

- `fileName` must not be empty
- `fileUrl` must be valid URL
- `publicId` must not be empty
- `fileSize` must be positive integer

### Interview Constraints

- `title` must not be empty
- `role` must not be empty
- `duration` must be positive integer (minutes)
- `status` must be valid InterviewStatus enum
- `startedAt` must be before `completedAt` (when both set)

### Question Constraints

- `question` must not be empty
- `order` must be positive integer
- `order` must be unique within Interview
- `type` must be valid QuestionType enum
- `difficulty` must be valid Difficulty enum

### Submission Constraints

- At least one of `answer` or `code` must be non-empty
- If `code` is provided, `language` must be provided
- One Submission per Question per Interview (unique constraint)

### Evaluation Constraints

- `score` must be between 0 and 100 (inclusive)
- `strengths`, `weaknesses`, `feedback` must not be empty
- One Evaluation per Interview

### Report Constraints

- `overallScore` must be between 0 and 100 (inclusive)
- `recommendation` and `summary` must not be empty
- One Report per Interview

---

## Data Integrity Rules

1. **Referential Integrity**: All foreign keys must reference existing records
2. **Ownership**: Users can only access resources they own
3. **Status Transitions**: Interview status must follow valid state machine
4. **Timestamps**: `createdAt` is immutable; `updatedAt` is automatically managed
5. **Nullability**: Only specified fields can be NULL
6. **Uniqueness**: Unique constraints must be enforced at database level
7. **Cascades**: Deletions must follow defined cascade rules

---

## Query Patterns

### Common Queries

1. **Get User's Interviews**:
   ```sql
   SELECT * FROM Interviews WHERE userId = ? ORDER BY createdAt DESC
   ```

2. **Get Interview with Questions**:
   ```sql
   SELECT * FROM Questions WHERE interviewId = ? ORDER BY order ASC
   ```

3. **Get Interview Report**:
   ```sql
   SELECT * FROM Reports WHERE interviewId = ?
   ```

4. **Get User's Report History**:
   ```sql
   SELECT * FROM Reports WHERE userId = ? ORDER BY createdAt DESC
   ```

5. **Get Interview Progress**:
   ```sql
   SELECT COUNT(*) FROM Submissions WHERE interviewId = ?
   ```

6. **Check Question Answered**:
   ```sql
   SELECT * FROM Submissions WHERE interviewId = ? AND questionId = ?
   ```

All queries will be optimized by the defined indexes.

---

## Scalability Considerations

1. **Partitioning**: Future partitioning by `userId` for large datasets
2. **Archiving**: Old completed interviews can be archived to separate tables
3. **Soft Deletes**: Can be implemented if data retention is required
4. **Caching**: Frequently accessed data (user profiles, active interviews) can be cached
5. **Read Replicas**: For analytics and reporting workloads

---

## Security Considerations

1. **Ownership Verification**: Always check `userId` matches authenticated user
2. **Sensitive Data**: Email and personal information should be encrypted in transit
3. **File Access**: Resume URLs from Cloudinary should be signed/temporary
4. **SQL Injection**: Prisma parameterizes queries automatically
5. **Access Control**: Enforce at service layer, not just database

---

## Success Criteria

✅ **All 7 tables fully specified** with fields, types, and constraints  
✅ **All 3 enums defined** with values and business rules  
✅ **All relationships documented** with cardinality and foreign keys  
✅ **Cascade rules defined** for all delete operations  
✅ **Indexes specified** for all common query patterns  
✅ **Validation rules documented** for all fields  
✅ **Ownership model clear** - User owns all resources  
✅ **Data integrity rules** defined and enforceable  
✅ **Ready for Prisma schema implementation**

---

## Next Steps

1. Implement Prisma schema based on this design
2. Generate migration from schema
3. Apply migration to Neon PostgreSQL database
4. Verify all tables, indexes, and constraints created
5. Test relationships and cascades
6. Update progress tracker

---

**Document Version**: 1.0  
**Last Updated**: 2026-07-25  
**Status**: Complete - Ready for Implementation
