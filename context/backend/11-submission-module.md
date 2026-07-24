# 11 Submission Module

## Goal

Capture, store, update, and manage candidate responses for each interview question.

---

## Tech Stack

- Express.js
- Prisma ORM
- PostgreSQL
- Zod

---

## Responsibilities

- Save answer
- Update answer
- Auto-save responses
- Retrieve submitted answers
- Mark question as answered
- Resume interrupted interviews

---

## Folder Structure

src/
├── controllers/
│   └── submission.controller.ts
├── services/
│   └── submission.service.ts
├── repositories/
│   └── submission.repository.ts
├── routes/
│   └── submission.routes.ts
├── validations/
│   └── submission.validation.ts
└── dto/
    └── submission.dto.ts

---

## Database Fields

Submission

- id
- interviewId
- questionId
- userId
- answer
- language
- code
- status
- submittedAt
- updatedAt

---

## Submission Status

- Draft
- Saved
- Submitted

---

## API Endpoints

POST   /api/v1/submissions

PATCH  /api/v1/submissions/:id

GET    /api/v1/submissions/interview/:interviewId

GET    /api/v1/submissions/:id

DELETE /api/v1/submissions/:id

---

## Validation

Required

- interviewId
- questionId

Optional

- answer
- code
- language

---

## Repository Methods

createSubmission()

findById()

findByInterview()

updateSubmission()

deleteSubmission()

---

## Service Methods

saveAnswer()

autoSave()

submitAnswer()

getSubmissions()

deleteSubmission()

---

## Controller Methods

create()

update()

list()

get()

delete()

---

## Business Rules

- One submission per question.
- User can edit only before interview completion.
- Auto-save should update existing submission.
- Submission belongs to authenticated user.
- Interview must be active.

---

## Security

- Verify interview ownership.
- Verify question belongs to interview.
- Prevent duplicate submissions.
- Use req.user.id only.

---

## Deliverables

✅ Submission Repository

✅ Submission Service

✅ Submission Controller

✅ Submission Routes

✅ Submission Validation

---

## AI Execution Prompt

Implement the Submission Module.

Requirements:

- Follow Controller → Service → Repository architecture.
- Store text and code answers.
- Support auto-save and final submission.
- Prevent duplicate submissions.
- Ensure ownership validation.
- Use Prisma ORM and Zod validation.

---

## Success Criteria

- Answers save successfully.
- Auto-save updates existing submission.
- One submission per question.
- Users access only their own submissions.
- Interview completion locks editing.
- ESLint and TypeScript pass.