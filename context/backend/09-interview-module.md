# 09-interview-module.md

# Interview Module

## Brief

Allow authenticated users to create, configure, manage, and track interview sessions.

---

## Goal

Implement complete interview management.

---

## Prerequisites

✅ Authentication Module

✅ User Module

✅ Resume Module

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
    interview.controller.js

services/
    interview.service.js

repositories/
    interview.repository.js

routes/
    interview.routes.js

validations/
    interview.validation.js

---

# Database

Table

Interview

Fields

id

userId

resumeId

title

role

company

experienceLevel

interviewType

duration

status

startedAt

completedAt

createdAt

updatedAt

---

# Interview Status

- DRAFT
- SCHEDULED
- IN_PROGRESS
- COMPLETED
- CANCELLED

---

# Routes

POST /api/v1/interviews

Description

Create a new interview.

---

GET /api/v1/interviews

Description

Get all interviews of the logged-in user.

---

GET /api/v1/interviews/:id

Description

Get interview details.

---

PATCH /api/v1/interviews/:id

Description

Update interview details.

---

DELETE /api/v1/interviews/:id

Description

Delete interview.

---

POST /api/v1/interviews/:id/start

Description

Start interview.

---

POST /api/v1/interviews/:id/complete

Description

Complete interview.

---

# Validation

Required

- title
- role
- experienceLevel
- interviewType
- duration

Optional

- company
- resumeId

---

# Repository

Methods

createInterview()

findById()

findByUserId()

updateInterview()

deleteInterview()

updateStatus()

---

# Service

Methods

createInterview()

getInterview()

listInterviews()

updateInterview()

deleteInterview()

startInterview()

completeInterview()

Responsibilities

- Validate ownership
- Validate resume belongs to user
- Manage interview status
- Prevent invalid operations

---

# Controller

Methods

create()

list()

get()

update()

remove()

start()

complete()

---

# Business Rules

- Authentication required.
- User can manage only their own interviews.
- Resume must belong to the logged-in user.
- Completed interviews cannot be edited.
- Completed interviews cannot be restarted.
- Only DRAFT or SCHEDULED interviews can be started.
- Only IN_PROGRESS interviews can be completed.

---

# Security

- Verify ownership.
- Validate interview status transitions.
- Never trust interview ID without ownership verification.
- Always use authenticated user from auth middleware.

---

# Deliverables

✅ Interview Repository

✅ Interview Service

✅ Interview Controller

✅ Interview Routes

✅ Interview Validation

---

# AI Execution Prompt

Implement the Interview Module.

Requirements

- Use JavaScript (ES Modules).
- Use Prisma ORM.
- Use Zod validation.
- Implement CRUD operations.
- Implement start and complete interview actions.
- Validate interview status transitions.
- Ensure users can access only their own interviews.
- Follow Route → Controller → Service → Repository architecture.
- Do not implement Question or AI modules.

---

# Success Criteria

✓ Interview created successfully

✓ Interview updated successfully

✓ Interview started successfully

✓ Interview completed successfully

✓ Users can access only their own interviews

✓ Invalid status transitions rejected

✓ Ready for Question Module