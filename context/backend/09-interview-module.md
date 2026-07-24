# 09 Interview Module

## Goal

Allow users to create, configure, manage, and track interview sessions.

---

## Tech Stack

- Express.js
- Prisma ORM
- PostgreSQL
- Zod

---

## Responsibilities

- Create interview
- Configure interview settings
- Fetch interview details
- Update interview
- Delete interview
- Start interview
- Complete interview
- Track interview status

---

## Folder Structure

src/
├── controllers/
│   └── interview.controller.ts
├── services/
│   └── interview.service.ts
├── repositories/
│   └── interview.repository.ts
├── routes/
│   └── interview.routes.ts
├── validations/
│   └── interview.validation.ts
└── dto/
    └── interview.dto.ts

---

## Database Fields

Interview

- id
- userId
- resumeId
- title
- role
- company
- experienceLevel
- interviewType
- duration
- status
- startedAt
- completedAt
- createdAt
- updatedAt

---

## Interview Status

- Draft
- Scheduled
- In Progress
- Completed
- Cancelled

---

## API Endpoints

POST   /api/v1/interviews

GET    /api/v1/interviews

GET    /api/v1/interviews/:id

PATCH  /api/v1/interviews/:id

DELETE /api/v1/interviews/:id

POST   /api/v1/interviews/:id/start

POST   /api/v1/interviews/:id/complete

---

## Validation

Required Fields

- title
- role
- experienceLevel
- interviewType
- duration

Optional

- company
- resumeId

---

## Repository Methods

createInterview()

findById()

findByUser()

updateInterview()

deleteInterview()

changeStatus()

---

## Service Methods

createInterview()

getInterview()

listInterviews()

updateInterview()

deleteInterview()

startInterview()

completeInterview()

---

## Controller Methods

create()

list()

get()

update()

delete()

start()

complete()

---

## Business Rules

- User must be authenticated.
- User can access only their own interviews.
- Resume must belong to the user.
- Cannot edit a completed interview.
- Cannot start an interview twice.
- Status transitions must be valid.

---

## Security

- Verify ownership.
- Validate interview status transitions.
- Prevent unauthorized access.
- Use req.user.id only.

---

## Deliverables

✅ Interview Repository

✅ Interview Service

✅ Interview Controller

✅ Interview Routes

✅ Interview Validation

---

## AI Execution Prompt

Implement the Interview Module.

Requirements:

- Follow Controller → Service → Repository architecture.
- Use Prisma ORM.
- Use Zod validation.
- Support CRUD operations.
- Implement start and complete interview actions.
- Validate interview status transitions.
- Ensure users access only their own interviews.
- Follow project coding standards.

---

## Success Criteria

- Interview can be created.
- Interview can be updated.
- Interview can be started.
- Interview can be completed.
- Users see only their own interviews.
- Invalid status transitions are rejected.
- ESLint and TypeScript pass.