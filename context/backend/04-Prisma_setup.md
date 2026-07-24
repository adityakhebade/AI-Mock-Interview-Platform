# 04-prisma-setup.md

# IntervueX Prisma Setup

## Goal

Set up Prisma ORM with PostgreSQL and create the initial database schema for IntervueX.

After completing this step:

- Prisma should be connected to PostgreSQL.
- All database models should be created.
- Prisma Client should be generated.
- Initial migration should be completed.

---

# Prerequisites

✅ Backend Setup Complete

✅ Backend Architecture Complete

✅ Database Design Approved

---

# Install Packages

Runtime

@prisma/client

Development

prisma

---

# Initialize Prisma

Run

npx prisma init

This should create

prisma/
    schema.prisma

.env

---

# Configure Environment

Add

DATABASE_URL=

inside

.env

Use PostgreSQL connection string.

---

# Configure Prisma

Datasource

PostgreSQL

Generator

Prisma Client

Output

Default

---

# Create Models

Create the following models.

User

Resume

Interview

Question

Submission

Evaluation

Report

---

# User Model

Fields

id

clerkId

name

email

imageUrl

createdAt

updatedAt

Relations

resumes

interviews

reports

---

# Resume Model

Fields

id

userId

fileName

fileUrl

publicId

fileSize

createdAt

updatedAt

Relation

User

---

# Interview Model

Fields

id

userId

resumeId

title

role

difficulty

language

duration

status

startedAt

completedAt

createdAt

updatedAt

Relations

User

Resume

Questions

Submissions

Evaluation

Report

---

# Question Model

Fields

id

interviewId

question

type

difficulty

order

createdAt

Relation

Interview

---

# Submission Model

Fields

id

interviewId

questionId

answer

code

language

createdAt

Relations

Interview

Question

---

# Evaluation Model

Fields

id

interviewId

score

strengths

weaknesses

feedback

createdAt

Relation

Interview

---

# Report Model

Fields

id

userId

interviewId

overallScore

recommendation

summary

createdAt

Relations

User

Interview

---

# Create Enums

InterviewStatus

DRAFT

IN_PROGRESS

COMPLETED

CANCELLED

Difficulty

EASY

MEDIUM

HARD

QuestionType

MCQ

TECHNICAL

CODING

HR

BEHAVIORAL

---

# Relationships

User

↓

Many Interviews

↓

Many Resumes

↓

Many Reports

Interview

↓

Many Questions

↓

Many Submissions

↓

One Evaluation

↓

One Report

---

# Constraints

Email Unique

ClerkId Unique

One Evaluation Per Interview

One Report Per Interview

Question Order Unique Per Interview

One Submission Per Question

---

# Generate Prisma Client

Run

npx prisma generate

---

# Create Migration

Run

npx prisma migrate dev --name init

---

# Verify Database

Open

Prisma Studio

Run

npx prisma studio

Verify

All tables exist.

Relationships exist.

Enums exist.

---

# Deliverables

✅ Prisma configured

✅ PostgreSQL connected

✅ schema.prisma completed

✅ Prisma Client generated

✅ Initial migration completed

✅ Database ready

---

# AI Execution Prompt

Implement Prisma for IntervueX.

Requirements

- Use PostgreSQL.
- Configure Prisma.
- Create all models exactly as specified.
- Create enums.
- Create relationships.
- Add unique constraints.
- Generate Prisma Client.
- Run the initial migration.
- Verify using Prisma Studio.
- Do not implement API routes or business logic.

---

# Success Criteria

✓ Prisma connected

✓ Database migrated

✓ Prisma Client generated

✓ All models created

✓ All relations working

✓ Ready for API Design