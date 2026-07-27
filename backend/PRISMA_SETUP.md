# Prisma Setup Documentation

## Overview

IntervueX uses **Prisma ORM** to interact with a **PostgreSQL** database hosted on **Neon**. This document explains the complete setup, schema, and usage patterns.

---

## Configuration

### Database Connection

The database connection string is configured in `.env`:

```env
DATABASE_URL="postgresql://neondb_owner:...@ep-shy-firefly-aw0b1ofu-pooler.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

**Connection Details**:
- **Provider**: PostgreSQL (Neon Serverless)
- **Host**: ep-shy-firefly-aw0b1ofu-pooler.c-12.us-east-1.aws.neon.tech
- **Database**: neondb
- **SSL**: Required with channel binding

---

## Prisma Client

### Singleton Pattern

The Prisma Client is initialized as a singleton in `src/config/prisma.js`:

```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;
```

**Features**:
- Prevents multiple instances during development hot reload
- Logs queries in development mode
- Only logs errors in production

### Usage in Repositories

```javascript
import prisma from '../config/prisma.js';

// Example: Find user by ID
const user = await prisma.user.findUnique({
  where: { id: userId },
});

// Example: Create interview
const interview = await prisma.interview.create({
  data: {
    userId,
    title: 'Frontend Interview',
    role: 'React Developer',
    difficulty: 'MEDIUM',
    language: 'JavaScript',
    duration: 60,
    status: 'DRAFT',
  },
});
```

---

## Database Schema

### Tables (7)

1. **users** - Application users synced from Clerk
2. **resumes** - Uploaded resume metadata
3. **interviews** - Interview session records
4. **questions** - Interview questions
5. **submissions** - Candidate answers
6. **evaluations** - AI evaluation results
7. **reports** - Final interview reports

### Enums (3)

1. **InterviewStatus**: `DRAFT`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`
2. **Difficulty**: `EASY`, `MEDIUM`, `HARD`
3. **QuestionType**: `MCQ`, `TECHNICAL`, `CODING`, `HR`, `BEHAVIORAL`

---

## Models

### User

Stores application users synchronized from Clerk.

```javascript
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
}
```

**Key Fields**:
- `clerkId` - Unique identifier from Clerk (used for authentication)
- `email` - Unique email address
- `imageUrl` - Optional profile picture URL

**Relationships**:
- One User → Many Resumes
- One User → Many Interviews
- One User → Many Reports

---

### Resume

Stores metadata for uploaded resume files (actual files in Cloudinary).

```javascript
model Resume {
  id        String   @id @default(cuid())
  userId    String
  fileName  String
  fileUrl   String
  publicId  String   // Cloudinary public ID
  fileSize  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user       User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  interviews Interview[]
}
```

**Key Fields**:
- `fileUrl` - Cloudinary URL to access the file
- `publicId` - Cloudinary identifier for deletion
- `fileSize` - Size in bytes

**Cascade Rules**:
- Deleting User → Deletes all Resumes

---

### Interview

Stores interview session records.

```javascript
model Interview {
  id          String          @id @default(cuid())
  userId      String
  resumeId    String?
  title       String
  role        String
  difficulty  Difficulty
  language    String
  duration    Int              // Minutes
  status      InterviewStatus @default(DRAFT)
  startedAt   DateTime?
  completedAt DateTime?
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  resume      Resume?      @relation(fields: [resumeId], references: [id], onDelete: SetNull)
  questions   Question[]
  submissions Submission[]
  evaluation  Evaluation?
  report      Report?
}
```

**Status Transitions**:
- `DRAFT` → `IN_PROGRESS` (when user starts interview)
- `IN_PROGRESS` → `COMPLETED` (when user submits all answers)
- `IN_PROGRESS` → `CANCELLED` (if user cancels)

**Cascade Rules**:
- Deleting User → Deletes all Interviews
- Deleting Interview → Deletes Questions, Submissions, Evaluation, Report
- Deleting Resume → Sets `resumeId` to NULL (doesn't delete Interview)

---

### Question

Stores interview questions.

```javascript
model Question {
  id          String       @id @default(cuid())
  interviewId String
  question    String       @db.Text
  type        QuestionType
  difficulty  Difficulty
  order       Int
  createdAt   DateTime     @default(now())

  interview   Interview    @relation(fields: [interviewId], references: [id], onDelete: Cascade)
  submissions Submission[]
}
```

**Constraints**:
- `order` must be unique within each Interview
- Questions are ordered starting from 1

---

### Submission

Stores candidate answers to interview questions.

```javascript
model Submission {
  id          String   @id @default(cuid())
  interviewId String
  questionId  String
  answer      String?  @db.Text
  code        String?  @db.Text
  language    String?  // Programming language for code
  createdAt   DateTime @default(now())

  interview Interview @relation(fields: [interviewId], references: [id], onDelete: Cascade)
  question  Question  @relation(fields: [questionId], references: [id], onDelete: Cascade)
}
```

**Constraints**:
- One Submission per Question per Interview (unique constraint)
- At least one of `answer` or `code` must be provided

---

### Evaluation

Stores AI-generated evaluation of interview performance.

```javascript
model Evaluation {
  id          String   @id @default(cuid())
  interviewId String   @unique
  score       Int      // 0-100
  strengths   String   @db.Text
  weaknesses  String   @db.Text
  feedback    String   @db.Text
  createdAt   DateTime @default(now())

  interview Interview @relation(fields: [interviewId], references: [id], onDelete: Cascade)
}
```

**Constraints**:
- One Evaluation per Interview (1:1 relationship)
- Score must be between 0-100

---

### Report

Stores final interview reports for user review.

```javascript
model Report {
  id             String   @id @default(cuid())
  userId         String
  interviewId    String   @unique
  overallScore   Int      // 0-100
  recommendation String   @db.Text
  summary        String   @db.Text
  createdAt      DateTime @default(now())

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  interview Interview @relation(fields: [interviewId], references: [id], onDelete: Cascade)
}
```

**Constraints**:
- One Report per Interview (1:1 relationship)
- Reports are read-only after creation

---

## Common Query Patterns

### User Queries

```javascript
// Find user by Clerk ID
const user = await prisma.user.findUnique({
  where: { clerkId: 'clerk_user_123' },
});

// Get user with all interviews
const userWithInterviews = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    interviews: {
      orderBy: { createdAt: 'desc' },
    },
  },
});
```

### Interview Queries

```javascript
// Get user's active interviews
const activeInterviews = await prisma.interview.findMany({
  where: {
    userId,
    status: { in: ['DRAFT', 'IN_PROGRESS'] },
  },
  orderBy: { createdAt: 'desc' },
});

// Get interview with questions and submissions
const interviewDetails = await prisma.interview.findUnique({
  where: { id: interviewId },
  include: {
    questions: {
      orderBy: { order: 'asc' },
    },
    submissions: true,
    evaluation: true,
    report: true,
  },
});
```

### Question and Submission Queries

```javascript
// Get questions for interview
const questions = await prisma.question.findMany({
  where: { interviewId },
  orderBy: { order: 'asc' },
});

// Create or update submission
const submission = await prisma.submission.upsert({
  where: {
    interviewId_questionId: {
      interviewId,
      questionId,
    },
  },
  update: { answer: 'Updated answer' },
  create: {
    interviewId,
    questionId,
    answer: 'New answer',
  },
});
```

### Report Queries

```javascript
// Get user's report history
const reports = await prisma.report.findMany({
  where: { userId },
  orderBy: { createdAt: 'desc' },
  include: {
    interview: {
      select: {
        title: true,
        role: true,
        difficulty: true,
        completedAt: true,
      },
    },
  },
});
```

---

## Indexes

All common query patterns are optimized with indexes:

### User Indexes
- `clerkId` (unique) - Authentication lookups
- `email` (unique) - User identification

### Interview Indexes
- `userId` - User's interviews
- `status` - Filter by status
- `(userId, status)` - Combined filter

### Question Indexes
- `interviewId` - Interview questions
- `(interviewId, order)` - Ordered retrieval

### Submission Indexes
- `interviewId` - Interview submissions
- `questionId` - Question lookups
- `(interviewId, questionId)` - Unique constraint

### Report Indexes
- `userId` - User's reports
- `(userId, createdAt)` - Sorted history

---

## Transactions

For operations that require multiple database changes:

```javascript
// Example: Complete interview with evaluation and report
const result = await prisma.$transaction(async (tx) => {
  // Update interview status
  const interview = await tx.interview.update({
    where: { id: interviewId },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
    },
  });

  // Create evaluation
  const evaluation = await tx.evaluation.create({
    data: {
      interviewId,
      score: 85,
      strengths: '...',
      weaknesses: '...',
      feedback: '...',
    },
  });

  // Create report
  const report = await tx.report.create({
    data: {
      userId,
      interviewId,
      overallScore: 85,
      recommendation: '...',
      summary: '...',
    },
  });

  return { interview, evaluation, report };
});
```

---

## Migration Management

### Create Migration

After updating `schema.prisma`:

```bash
npx prisma migrate dev --name descriptive_name
```

### Apply Migrations (Production)

```bash
npx prisma migrate deploy
```

### Reset Database (Development Only)

```bash
npx prisma migrate reset
```

---

## Prisma Studio

Visual database browser:

```bash
npm run prisma:studio
```

Opens at `http://localhost:5555`

---

## Testing

Test Prisma connection:

```bash
node test-prisma.js
```

Expected output:
```
✅ Connected to PostgreSQL database

📊 Database Statistics:
   Users:       X
   Interviews:  X
   Resumes:     X
   ...

✅ All Prisma models working correctly!
```

---

## Best Practices

### 1. Repository Layer Only

**✅ DO**: Access Prisma only in repositories

```javascript
// ✅ CORRECT: repositories/user.repository.js
export const userRepository = {
  async findByClerkId(clerkId) {
    return await prisma.user.findUnique({
      where: { clerkId },
    });
  },
};
```

**❌ DON'T**: Access Prisma in controllers or services

```javascript
// ❌ WRONG: controllers/user.controller.js
const user = await prisma.user.findUnique({ ... }); // Never do this
```

### 2. Select Only What You Need

```javascript
// ✅ Efficient
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    name: true,
    email: true,
  },
});

// ❌ Wasteful
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    interviews: { include: { questions: true, submissions: true } },
    resumes: true,
    reports: true,
  },
});
```

### 3. Use Transactions for Multi-Step Operations

```javascript
// ✅ Atomic operation
await prisma.$transaction([
  prisma.interview.update({ ... }),
  prisma.evaluation.create({ ... }),
  prisma.report.create({ ... }),
]);
```

### 4. Handle Errors Properly

```javascript
try {
  const user = await prisma.user.create({ data: { ... } });
  return user;
} catch (error) {
  if (error.code === 'P2002') {
    throw new AppError('Email already exists', 409);
  }
  throw error;
}
```

---

## Prisma Error Codes

Common error codes:

- `P2002` - Unique constraint violation
- `P2003` - Foreign key constraint violation
- `P2025` - Record not found
- `P2016` - Query interpretation error

Full list: https://www.prisma.io/docs/reference/api-reference/error-reference

---

## Verification Checklist

✅ Prisma installed (`@prisma/client`, `prisma`)  
✅ Schema created (`prisma/schema.prisma`)  
✅ Database connected (`DATABASE_URL` in `.env`)  
✅ Migration applied (`npx prisma migrate dev`)  
✅ Prisma Client generated (`npx prisma generate`)  
✅ All 7 models created  
✅ All 3 enums defined  
✅ All relationships working  
✅ All indexes created  
✅ Cascade rules configured  
✅ Prisma singleton created (`src/config/prisma.js`)  
✅ Connection tested (`node test-prisma.js`)  
✅ Server starts successfully

---

## Next Steps

1. ✅ Prisma setup complete
2. ➡️ Implement User repository (already using Prisma)
3. ➡️ Implement Interview repository
4. ➡️ Implement Resume repository
5. ➡️ Implement Question and Submission repositories
6. ➡️ Implement Evaluation and Report repositories

---

**Setup Date**: 2026-07-25  
**Prisma Version**: 5.22.0  
**Database**: Neon PostgreSQL  
**Status**: ✅ Complete and Verified
