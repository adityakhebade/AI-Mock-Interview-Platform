# 03-database-design.md

# IntervueX Database Design

## Goal

Design the complete database structure for IntervueX before creating the Prisma schema.

This document defines:

- Tables
- Relationships
- Ownership
- Enums
- Constraints

Do NOT write the Prisma schema yet.

---

# Database

PostgreSQL

ORM

Prisma

---

# Tables

1. Users

2. Resumes

3. Interviews

4. Questions

5. Submissions

6. Evaluations

7. Reports

---

# Users

Purpose

Store application users synced from Clerk.

Fields

id

clerkId

name

email

imageUrl

createdAt

updatedAt

Relationship

One User

↓

Many Interviews

Many Resumes

Many Reports

---

# Resumes

Purpose

Store uploaded resumes.

Fields

id

userId

fileName

fileUrl

publicId

fileSize

createdAt

updatedAt

Relationship

Many Resumes

↓

One User

---

# Interviews

Purpose

Store interview sessions.

Fields

id

userId

resumeId (nullable)

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

Relationship

Interview

↓

One User

Interview

↓

Many Questions

Interview

↓

Many Submissions

Interview

↓

One Evaluation

Interview

↓

One Report

---

# Questions

Purpose

Store interview questions.

Fields

id

interviewId

question

type

difficulty

order

createdAt

Relationship

Many Questions

↓

One Interview

---

# Submissions

Purpose

Store candidate answers.

Fields

id

interviewId

questionId

answer

code

language

createdAt

Relationship

Submission

↓

One Interview

Submission

↓

One Question

---

# Evaluations

Purpose

Store AI evaluation.

Fields

id

interviewId

score

strengths

weaknesses

feedback

createdAt

Relationship

One Evaluation

↓

One Interview

---

# Reports

Purpose

Store final interview report.

Fields

id

userId

interviewId

overallScore

recommendation

summary

createdAt

Relationship

One Report

↓

One Interview

Many Reports

↓

One User

---

# Relationships

User

↓

Many Resumes

↓

Many Interviews

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

# Interview Status

DRAFT

IN_PROGRESS

COMPLETED

CANCELLED

---

# Difficulty

EASY

MEDIUM

HARD

---

# Question Type

MCQ

TECHNICAL

CODING

HR

BEHAVIORAL

---

# Ownership Rules

User

owns

↓

Resume

↓

Interview

↓

Report

Questions belong to Interview.

Submissions belong to Interview.

Evaluation belongs to Interview.

---

# Cascade Rules

Deleting User

↓

Delete Interviews

↓

Delete Questions

↓

Delete Submissions

↓

Delete Evaluation

↓

Delete Report

↓

Delete Resumes

---

# Indexes

Users

clerkId

email

Interviews

userId

status

Questions

interviewId

Submissions

interviewId

questionId

Reports

userId

interviewId

---

# Validation Rules

Email unique.

ClerkId unique.

One Evaluation per Interview.

One Report per Interview.

One Submission per Question.

Question order must be unique inside Interview.

---

# Deliverables

✅ Complete Database Design

✅ Relationships Defined

✅ Constraints Defined

✅ Ownership Rules Defined

✅ Ready for Prisma Schema

---

# AI Execution Prompt

Design the IntervueX database.

Requirements

- PostgreSQL
- Prisma ORM
- Do NOT generate Prisma schema yet.
- Define all entities.
- Define relationships.
- Define ownership.
- Define indexes.
- Define constraints.
- Keep the design scalable.
- No implementation code.

---

# Success Criteria

✓ All tables finalized

✓ Relationships finalized

✓ Constraints finalized

✓ Ready for Prisma Schema implementation