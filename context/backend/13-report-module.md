# 13-report-module.md

# Report Module

## Brief

Generate and manage interview reports based on completed evaluations. Reports provide users with a structured summary of their interview performance and analytics.

---

## Goal

Implement complete report management.

---

## Prerequisites

✅ Authentication Module

✅ Evaluation Module

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
    report.controller.js

services/
    report.service.js

repositories/
    report.repository.js

routes/
    report.routes.js

validations/
    report.validation.js

---

# Database

Table

Report

Fields

id

interviewId

evaluationId

userId

title

summary

strengths

weaknesses

recommendations

overallScore

generatedAt

createdAt

updatedAt

---

# Routes

POST /api/v1/reports/:interviewId

Description

Generate a report from an existing evaluation.

---

GET /api/v1/reports

Description

Get all reports of the authenticated user.

---

GET /api/v1/reports/:id

Description

Get a specific report.

---

DELETE /api/v1/reports/:id

Description

Delete a report.

---

# Validation

Required

- interviewId

---

# Repository

Methods

createReport()

findById()

findByInterviewId()

findByUserId()

deleteReport()

---

# Service

Methods

generateReport()

getReport()

listReports()

deleteReport()

Responsibilities

- Verify evaluation exists
- Generate report from evaluation data
- Store report
- Prevent duplicate reports

---

# Controller

Methods

generate()

list()

get()

remove()

---

# Business Rules

- Report can only be generated after evaluation is completed.
- One report per interview.
- Users can access only their own reports.
- Reports are read-only after generation.
- Reports use evaluation data as the source of truth.

---

# Security

- Verify user ownership.
- Prevent duplicate report generation.
- Never expose reports belonging to another user.
- Always use authenticated user from auth middleware.

---

# Deliverables

✅ Report Repository

✅ Report Service

✅ Report Controller

✅ Report Routes

✅ Report Validation

---

# AI Execution Prompt

Implement the Report Module.

Requirements

- Use JavaScript (ES Modules).
- Generate reports from completed evaluation data.
- Store reports in PostgreSQL.
- Implement report retrieval, listing, and deletion.
- Ensure one report per interview.
- Validate ownership using the authenticated user.
- Use Prisma ORM and Zod validation.
- Follow Route → Controller → Service → Repository architecture.
- Do not implement AI-generated summaries or feedback.

---

# Success Criteria

✓ Report generated successfully

✓ Report stored in PostgreSQL

✓ Users can access only their own reports

✓ Duplicate reports prevented

✓ Ready for Dashboard Module