# 05-api-design.md

# IntervueX API Design

## Goal

Design all REST APIs used by the frontend.

This document defines:

- API endpoints
- HTTP methods
- Request body
- Response body
- Status codes

Do NOT implement the APIs yet.

---

# Base URL

/api/v1

---

# Response Format

Success

{
    "success": true,
    "data": {}
}

Error

{
    "success": false,
    "message": "Error message"
}

---

# Authentication APIs

POST /auth/sync

Purpose

Create or update the logged-in user after Clerk authentication.

Authentication

Required

Response

User Profile

---

GET /auth/me

Purpose

Return current logged-in user.

Authentication

Required

Response

User

---

# User APIs

GET /users/profile

Purpose

Get profile.

---

PATCH /users/profile

Purpose

Update profile.

---

# Resume APIs

POST /resumes

Purpose

Upload Resume.

Multipart Form Data

File

Response

Resume Details

---

GET /resumes

Purpose

List User Resumes.

---

GET /resumes/:id

Purpose

Get Resume.

---

DELETE /resumes/:id

Purpose

Delete Resume.

---

# Interview APIs

POST /interviews

Purpose

Create Interview.

---

GET /interviews

Purpose

List Interviews.

---

GET /interviews/:id

Purpose

Interview Details.

---

PATCH /interviews/:id

Purpose

Update Interview.

---

DELETE /interviews/:id

Purpose

Delete Interview.

---

POST /interviews/:id/start

Purpose

Start Interview.

---

POST /interviews/:id/complete

Purpose

Complete Interview.

---

# Question APIs

POST /questions/generate

Purpose

Generate AI Questions.

---

GET /questions/interview/:interviewId

Purpose

Get Interview Questions.

---

PATCH /questions/:id

Purpose

Update Question.

---

DELETE /questions/:id

Purpose

Delete Question.

---

# Submission APIs

POST /submissions

Purpose

Save Answer.

---

PATCH /submissions/:id

Purpose

Update Answer.

---

GET /submissions/interview/:interviewId

Purpose

Get All Answers.

---

# Evaluation APIs

POST /evaluations/:interviewId

Purpose

Generate AI Evaluation.

---

GET /evaluations/:interviewId

Purpose

View Evaluation.

---

# Report APIs

POST /reports/:interviewId

Purpose

Generate Final Report.

---

GET /reports

Purpose

List Reports.

---

GET /reports/:id

Purpose

Report Details.

---

DELETE /reports/:id

Purpose

Delete Report.

---

# Dashboard APIs

GET /dashboard

Purpose

Dashboard Statistics.

Returns

Total Interviews

Average Score

Recent Interviews

Reports

Resume Count

---

# AI APIs

POST /ai/questions

Purpose

Generate Questions.

---

POST /ai/evaluate

Purpose

Evaluate Answers.

---

POST /ai/report

Purpose

Generate Report.

---

# Status Codes

200

Success

201

Created

400

Validation Error

401

Unauthorized

403

Forbidden

404

Not Found

409

Conflict

500

Internal Server Error

---

# Authentication

Protected APIs require Clerk Authentication.

Public APIs

GET /

GET /health

Everything else

Protected

---

# Folder Mapping

Routes

↓

Controllers

↓

Services

↓

Repositories

↓

Prisma

---

# Deliverables

✅ Complete API Design

✅ REST Endpoints

✅ Response Structure

✅ Status Codes

✅ Authentication Rules

---

# AI Execution Prompt

Design all REST APIs for IntervueX.

Requirements

- Follow REST principles.
- Use /api/v1.
- Define all endpoints.
- Define request/response formats.
- Use proper HTTP methods.
- Do not implement controllers or routes.
- Keep the API scalable.

---

# Success Criteria

✓ API contract finalized

✓ Frontend and backend aligned

✓ Ready for Authentication Module