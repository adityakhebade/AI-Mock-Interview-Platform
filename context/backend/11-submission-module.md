# 11-submission-module.md

# Submission Module

## Brief

Capture, store, update, and manage candidate responses for interview questions. Support text, code, and voice answers with automatic saving throughout the interview.

---

## Goal

Implement complete submission management.

---

## Prerequisites

✅ Authentication Module

✅ Interview Module

✅ Question Module

---

# Tech Stack

- Express.js
- JavaScript (ES Modules)
- Prisma ORM
- PostgreSQL
- Zod

---

# Folder Structure

src/

controllers/
    submission.controller.js

services/
    submission.service.js

repositories/
    submission.repository.js

routes/
    submission.routes.js

validations/
    submission.validation.js

---

# Database

Table

Submission

Fields

id

interviewId

questionId

userId

answer

code

language

audioUrl

status

submittedAt

updatedAt

---

# Submission Status

- DRAFT
- SAVED
- SUBMITTED

---

# Routes

POST /api/v1/submissions

Description

Create a submission or auto-save the first answer.

---

PATCH /api/v1/submissions/:id

Description

Update an existing submission.

---

POST /api/v1/submissions/:id/submit

Description

Finalize a submission.

---

GET /api/v1/submissions/interview/:interviewId

Description

Get all submissions for an interview.

---

GET /api/v1/submissions/:id

Description

Get a specific submission.

---

DELETE /api/v1/submissions/:id

Description

Delete a submission.

---

# Validation

Required

- interviewId
- questionId

Optional

- answer
- code
- language
- audioUrl

---

# Repository

Methods

createSubmission()

findById()

findByInterviewId()

findByQuestionId()

updateSubmission()

deleteSubmission()

---

# Service

Methods

saveSubmission()

updateSubmission()

submitSubmission()

getSubmission()

listSubmissions()

deleteSubmission()

Responsibilities

- Auto-save responses
- Store text, code, and audio answers
- Prevent duplicate submissions
- Lock editing after submission
- Verify ownership

---

# Controller

Methods

create()

update()

submit()

list()

get()

remove()

---

# Business Rules

- One submission per question.
- Auto-save updates the existing submission.
- User can edit only before interview completion.
- Submitted responses cannot be modified.
- Submission belongs to the authenticated user.
- Question must belong to the interview.
- Interview must be in progress.

---

# Security

- Verify interview ownership.
- Verify question ownership.
- Prevent duplicate submissions.
- Always use authenticated user from auth middleware.
- Never trust userId from the client.

---

# Deliverables

✅ Submission Repository

✅ Submission Service

✅ Submission Controller

✅ Submission Routes

✅ Submission Validation

---

# AI Execution Prompt

Implement the Submission Module.

Requirements

- Use JavaScript (ES Modules).
- Implement CRUD operations.
- Support text, code, and audio answers.
- Auto-save responses.
- Support final submission.
- Prevent duplicate submissions.
- Validate ownership.
- Use Prisma ORM and Zod validation.
- Follow Route → Controller → Service → Repository architecture.
- Do not implement AI evaluation.

---

# Success Criteria

✓ Answers saved successfully

✓ Auto-save updates existing submission

✓ Final submission works

✓ One submission per question

✓ Users access only their own submissions

✓ Editing locked after submission

✓ Ready for Evaluation Module