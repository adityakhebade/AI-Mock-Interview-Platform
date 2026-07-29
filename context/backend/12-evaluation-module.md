# 12-evaluation-module.md

# Evaluation Module

## Brief

Manage interview evaluation results. Store, retrieve, and manage AI-generated interview scores and feedback.

---

## Goal

Implement evaluation management.

---

## Prerequisites

✅ Authentication Module

✅ Interview Module

✅ Submission Module

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
    evaluation.controller.js

services/
    evaluation.service.js

repositories/
    evaluation.repository.js

routes/
    evaluation.routes.js

validations/
    evaluation.validation.js

---

# Database

Table

Evaluation

Fields

id

interviewId

userId

overallScore

technicalScore

communicationScore

problemSolvingScore

strengths

weaknesses

feedback

status

evaluatedAt

createdAt

updatedAt

---

# Evaluation Status

- PENDING
- PROCESSING
- COMPLETED
- FAILED

---

# Routes

POST /api/v1/evaluations/:interviewId

Description

Create an evaluation request for a completed interview.

---

GET /api/v1/evaluations/:interviewId

Description

Get evaluation for an interview.

---

GET /api/v1/evaluations

Description

Get all evaluations of the authenticated user.

---

# Validation

Required

- interviewId

---

# Repository

Methods

createEvaluation()

findByInterviewId()

findByUserId()

updateEvaluation()

---

# Service

Methods

requestEvaluation()

getEvaluation()

listEvaluations()

updateEvaluation()

Responsibilities

- Verify interview completion
- Prevent duplicate evaluations
- Store evaluation results
- Manage evaluation status

---

# Controller

Methods

create()

get()

list()

---

# Business Rules

- One evaluation per interview.
- Interview must be completed.
- User can access only their own evaluations.
- Evaluation cannot be regenerated unless explicitly requested.
- AI-generated scores and feedback are saved through this module.

---

# Security

- Verify interview ownership.
- Prevent duplicate evaluations.
- Validate interview completion.
- Always use authenticated user from auth middleware.

---

# Deliverables

✅ Evaluation Repository

✅ Evaluation Service

✅ Evaluation Controller

✅ Evaluation Routes

✅ Evaluation Validation

---

# AI Execution Prompt

Implement the Evaluation Module.

Requirements

- Use JavaScript (ES Modules).
- Implement evaluation CRUD operations.
- Store AI-generated scores and feedback.
- Prevent duplicate evaluations.
- Ensure users access only their own evaluations.
- Use Prisma ORM and Zod validation.
- Follow Route → Controller → Service → Repository architecture.
- Do not implement AI evaluation logic.

---

# Success Criteria

✓ Evaluation created successfully

✓ Scores stored in PostgreSQL

✓ Feedback stored successfully

✓ Users access only their own evaluations

✓ Duplicate evaluations prevented

✓ Ready for Report Module