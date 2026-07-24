# 10 Question Module

## Goal

Manage interview questions for each interview session. Questions can be AI-generated or manually added and will be presented during the interview.

---

## Tech Stack

- Express.js
- Prisma ORM
- PostgreSQL
- Zod

---

## Responsibilities

- Generate interview questions
- Store questions
- Retrieve questions
- Update question status
- Support question ordering

---

## Folder Structure

src/
├── controllers/
│   └── question.controller.ts
├── services/
│   └── question.service.ts
├── repositories/
│   └── question.repository.ts
├── routes/
│   └── question.routes.ts
├── validations/
│   └── question.validation.ts
└── dto/
    └── question.dto.ts

---

## Database Fields

Question

- id
- interviewId
- question
- type
- difficulty
- expectedAnswer
- order
- status
- createdAt
- updatedAt

---

## Question Types

- Technical
- Behavioral
- Coding
- System Design
- HR

---

## Difficulty Levels

- Easy
- Medium
- Hard

---

## Status

- Pending
- Answered
- Skipped

---

## API Endpoints

POST   /api/v1/questions/generate

GET    /api/v1/questions/interview/:interviewId

GET    /api/v1/questions/:id

PATCH  /api/v1/questions/:id

DELETE /api/v1/questions/:id

---

## Validation

Required

- interviewId
- type
- difficulty

Optional

- expectedAnswer

---

## Repository Methods

createQuestions()

findByInterview()

findById()

updateQuestion()

deleteQuestion()

---

## Service Methods

generateQuestions()

getInterviewQuestions()

updateQuestion()

deleteQuestion()

---

## Controller Methods

generate()

list()

get()

update()

delete()

---

## Business Rules

- Questions belong to one interview.
- Interview must belong to authenticated user.
- Questions are ordered.
- Order must be unique within an interview.
- Questions cannot be edited after interview completion.

---

## Security

- Verify interview ownership.
- Prevent access to other users' questions.
- Validate question order.
- Validate question type.

---

## Deliverables

✅ Question Repository

✅ Question Service

✅ Question Controller

✅ Question Routes

✅ Question Validation

---

## AI Execution Prompt

Implement the Question Module.

Requirements:

- Follow Controller → Service → Repository architecture.
- Store questions linked to interviews.
- Support AI-generated and manual questions.
- Implement CRUD operations.
- Validate ownership using req.user.id.
- Use Prisma ORM and Zod validation.
- Follow project coding standards.

---

## Success Criteria

- Questions are generated.
- Questions are stored correctly.
- Questions are retrieved in order.
- Users access only their own interview questions.
- CRUD operations work.
- ESLint and TypeScript pass.