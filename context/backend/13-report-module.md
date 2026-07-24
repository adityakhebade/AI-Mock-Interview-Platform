# 13 Report Module

## Goal

Generate and manage interview reports based on completed evaluations. Reports provide users with detailed performance insights and interview analytics.

---

## Tech Stack

- Express.js
- Prisma ORM
- PostgreSQL
- Zod

---

## Responsibilities

- Generate interview report
- Fetch report
- List all reports
- Share/download report (future)
- Maintain report history

---

## Folder Structure

src/
├── controllers/
│   └── report.controller.ts
├── services/
│   └── report.service.ts
├── repositories/
│   └── report.repository.ts
├── routes/
│   └── report.routes.ts
├── validations/
│   └── report.validation.ts
└── dto/
    └── report.dto.ts

---

## Database Fields

Report

- id
- interviewId
- evaluationId
- userId
- title
- summary
- strengths
- weaknesses
- recommendations
- overallScore
- generatedAt
- createdAt

---

## API Endpoints

POST   /api/v1/reports/:interviewId

GET    /api/v1/reports

GET    /api/v1/reports/:id

DELETE /api/v1/reports/:id

---

## Validation

Required

- interviewId

---

## Repository Methods

createReport()

findById()

findByUser()

deleteReport()

---

## Service Methods

generateReport()

getReport()

listReports()

deleteReport()

---

## Controller Methods

generate()

get()

list()

delete()

---

## Business Rules

- Report can only be generated after evaluation.
- One report per interview.
- Users can access only their own reports.
- Reports are read-only after generation.

---

## Security

- Verify user ownership.
- Prevent duplicate report generation.
- Never expose reports belonging to another user.

---

## Deliverables

✅ Report Repository

✅ Report Service

✅ Report Controller

✅ Report Routes

✅ Report Validation

---

## AI Execution Prompt

Implement the Report Module.

Requirements:

- Follow Controller → Service → Repository architecture.
- Generate report using Evaluation data.
- Store report in PostgreSQL.
- Support report retrieval and listing.
- Ensure one report per interview.
- Validate ownership using req.user.id.
- Use Prisma ORM and Zod validation.

---

## Success Criteria

- Report is generated successfully.
- Report stores evaluation summary.
- Users can view only their own reports.
- Duplicate reports are prevented.
- ESLint and TypeScript pass.