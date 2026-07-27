# 10-question-module.md

# Question Module

## Brief

Manage interview questions for each interview session. Questions can be created manually or by the AI Module and are linked to a specific interview.

---

## Goal

Implement complete question management.

---

## Prerequisites

✅ Authentication Module

✅ Interview Module

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
    question.controller.js

services/
    question.service.js

repositories/
    question.repository.js

routes/
    question.routes.js

validations/
    question.validation.js

---

# Database

Table

Question

Fields

id

interviewId

question

type

difficulty

expectedAnswer

order

status

createdAt

updatedAt

---

# Question Types

- Technical
- Behavioral
- Coding
- System Design
- HR

---

# Difficulty Levels

- Easy
- Medium
- Hard

---

# Status

- PENDING
- ANSWERED
- SKIPPED

---

# Routes

POST /api/v1/questions

Description

Create a question manually.

---

GET /api/v1/questions/interview/:interviewId

Description

Get all questions for an interview.

---

GET /api/v1/questions/:id

Description

Get a specific question.

---

PATCH /api/v1/questions/:id

Description

Update a question.

---

DELETE /api/v1/questions/:id

Description

Delete a question.

---

# Validation

Required

- interviewId
- question
- type
- difficulty

Optional

- expectedAnswer
- order

---

# Repository

Methods

createQuestion()

createManyQuestions()

findByInterviewId()

findById()

updateQuestion()

deleteQuestion()

---

# Service

Methods

createQuestion()

createManyQuestions()

getInterviewQuestions()

updateQuestion()

deleteQuestion()

Responsibilities

- Manage interview questions
- Validate ownership
- Maintain question order
- Prevent invalid updates

---

# Controller

Methods

create()

list()

get()

update()

remove()

---

# Business Rules

- Questions belong to one interview.
- Interview must belong to the authenticated user.
- Questions are ordered within an interview.
- Order must be unique for each interview.
- Completed interviews cannot have questions modified.
- AI-generated questions are created by the AI Module and stored using this module.

---

# Security

- Verify interview ownership.
- Prevent access to other users' questions.
- Validate question order.
- Validate question type.

---

# Deliverables

✅ Question Repository

✅ Question Service

✅ Question Controller

✅ Question Routes

✅ Question Validation

---

# AI Execution Prompt

Implement the Question Module.

Requirements

- Use JavaScript (ES Modules).
- Implement CRUD operations for interview questions.
- Store questions linked to interviews.
- Support manual creation and bulk insertion for AI-generated questions.
- Validate ownership using the authenticated user.
- Use Prisma ORM and Zod validation.
- Follow Route → Controller → Service → Repository architecture.
- Do not implement AI question generation.

---

# Success Criteria

✓ Questions created successfully

✓ Questions stored correctly

✓ Questions retrieved in order

✓ Users access only their own interview questions

✓ CRUD operations work

✓ Ready for Submission Module