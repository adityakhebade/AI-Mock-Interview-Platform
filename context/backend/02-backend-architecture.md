# 02-backend-architecture.md

# IntervueX Backend Architecture

## Goal

Define a clean, scalable backend architecture using Express.js and JavaScript.

Every backend feature must follow the same structure to keep the code modular and maintainable.

---

# Technology Stack

- Node.js
- Express.js
- JavaScript (ES Modules)
- Prisma ORM
- PostgreSQL
- Zod
- Clerk
- Socket.IO

---

# Architecture

Client

↓

Routes

↓

Controllers

↓

Services

↓

Repositories

↓

Prisma

↓

PostgreSQL

---

# Folder Structure

src/

├── config/

├── controllers/

├── middleware/

├── repositories/

├── routes/

├── services/

├── validations/

├── utils/

├── app.js

└── server.js

---

# Responsibilities

## Routes

Responsibilities

- Define API endpoints
- Attach middleware
- Call controllers

Do NOT

- Write business logic
- Access database

---

## Controllers

Responsibilities

- Receive request
- Validate request
- Call service
- Return response

Do NOT

- Query database
- Write business logic

---

## Services

Responsibilities

- Business logic
- Ownership checks
- AI integration
- State management

Do NOT

- Handle Express request/response
- Call Prisma directly

---

## Repositories

Responsibilities

- Database queries
- Prisma operations

Do NOT

- Return HTTP responses
- Validate requests
- Implement business rules

---

## Prisma

Responsibilities

- Database access only

---

# Request Flow

React Frontend

↓

Express Route

↓

Authentication Middleware

↓

Validation Middleware

↓

Controller

↓

Service

↓

Repository

↓

Prisma

↓

PostgreSQL

↓

JSON Response

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
  "message": "Something went wrong"
}

---

# API Structure

/api/v1/auth

/api/v1/users

/api/v1/resumes

/api/v1/interviews

/api/v1/questions

/api/v1/submissions

/api/v1/evaluations

/api/v1/reports

/api/v1/dashboard

/api/v1/ai

---

# Naming Convention

Controllers

auth.controller.js

user.controller.js

Services

auth.service.js

user.service.js

Repositories

auth.repository.js

user.repository.js

Routes

auth.routes.js

user.routes.js

Validation

auth.validation.js

user.validation.js

---

# Coding Rules

- Use JavaScript only.
- Use ES Modules.
- Use async/await.
- Keep functions small.
- One responsibility per file.
- Use meaningful names.
- No duplicate logic.

---

# Project Rules

Controllers must never access Prisma.

Services must never return HTTP responses.

Repositories must contain all database queries.

Routes should only map endpoints.

Business logic belongs inside Services.

Database logic belongs inside Repositories.

---

# Feature Development Workflow

Every feature must follow this order:

1. Route

↓

2. Validation

↓

3. Controller

↓

4. Service

↓

5. Repository

↓

6. Prisma

↓

7. Test

---

# Deliverables

✅ Layered Architecture

✅ Folder Responsibilities

✅ API Structure

✅ Coding Standards

✅ Development Workflow

---

# AI Execution Prompt

Implement the backend architecture for IntervueX.

Requirements:

- Keep the existing backend setup.
- Use JavaScript (ES Modules).
- Maintain the architecture:

Route → Controller → Service → Repository → Prisma

- Do not implement business modules.
- Do not create database models.
- Do not implement authentication.
- Ensure the folder structure matches the specification.
- Refactor existing files if necessary without changing functionality.

---

# Success Criteria

✓ Architecture implemented

✓ Layer responsibilities defined

✓ Folder structure finalized

✓ API structure ready

✓ Ready for Database Design