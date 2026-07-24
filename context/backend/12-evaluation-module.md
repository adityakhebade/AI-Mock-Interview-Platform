# 12 Evaluation Module

## Goal

Evaluate candidate submissions and generate scores, feedback, strengths, and weaknesses for each interview.

---

## Tech Stack

- Express.js
- Prisma ORM
- PostgreSQL
- Zod

---

## Responsibilities

- Evaluate submissions
- Calculate interview score
- Generate feedback
- Store evaluation results
- Track evaluation status

---

## Folder Structure

src/
├── controllers/
│   └── evaluation.controller.ts
├── services/
│   └── evaluation.service.ts
├── repositories/
│   └── evaluation.repository.ts
├── routes/
│   └── evaluation.routes.ts
├── validations/
│   └── evaluation.validation.ts
└── dto/
    └── evaluation.dto.ts

---

## Database Fields

Evaluation

- id
- interviewId
- userId
- overallScore
- technicalScore
- communicationScore
- problemSolvingScore
- strengths
- weaknesses
- feedback
- status
- evaluatedAt
- createdAt

---

## Evaluation Status

- Pending
- Processing
- Completed
- Failed

---

## API Endpoints

POST   /api/v1/evaluations/:interviewId

GET    /api/v1/evaluations/:interviewId

GET    /api/v1/evaluations

---

## Validation

Required

- interviewId

---

## Repository Methods

createEvaluation()

findByInterview()

updateEvaluation()

---

## Service Methods

evaluateInterview()

calculateScore()

generateFeedback()

getEvaluation()

---

## Controller Methods

evaluate()

get()

list()

---

## Business Rules

- One evaluation per interview.
- Interview must be completed.
- User can view only their own evaluation.
- Evaluation cannot run twice unless explicitly regenerated.

---

## Security

- Verify interview ownership.
- Validate interview completion.
- Prevent duplicate evaluations.

---

## Deliverables

✅ Evaluation Repository

✅ Evaluation Service

✅ Evaluation Controller

✅ Evaluation Routes

✅ Evaluation Validation

---

## AI Execution Prompt

Implement the Evaluation Module.

Requirements:

- Follow Controller → Service → Repository architecture.
- Evaluate completed interviews only.
- Calculate section-wise and overall scores.
- Store strengths, weaknesses, and feedback.
- Ensure one evaluation per interview.
- Use Prisma ORM and Zod validation.

---

## Success Criteria

- Evaluation is generated successfully.
- Scores are stored in PostgreSQL.
- Users access only their own evaluations.
- Duplicate evaluations are prevented.
- ESLint and TypeScript pass.