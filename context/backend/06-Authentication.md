# 06-authentication.md

# Authentication Module

## Brief

Implement authentication using **Clerk**.

The frontend authenticates users with Clerk. The backend verifies the Clerk token, synchronizes the user with PostgreSQL, and protects private APIs.

---

## Goal

- Verify Clerk JWT
- Create user if first login
- Return current user
- Protect private routes

---

## Prerequisites

✅ Backend Setup

✅ Prisma Setup

✅ API Design

---

# Folder Structure

src/

middleware/
    auth.middleware.js

controllers/
    auth.controller.js

services/
    auth.service.js

repositories/
    user.repository.js

routes/
    auth.routes.js

---

# Database

Use User table only.

---

# Routes

POST /api/v1/auth/sync

Description

Create user if not exists.

Return existing user otherwise.

---

GET /api/v1/auth/me

Description

Return logged in user.

---

# Middleware

Create

auth.middleware.js

Responsibilities

- Verify Clerk Token
- Extract Clerk User ID
- Attach authenticated user to request
- Reject invalid requests

---

# Repository

Create methods

findByClerkId()

createUser()

findById()

---

# Service

Create methods

syncUser()

getCurrentUser()

Responsibilities

- Check if user exists
- Create if not found
- Return profile

---

# Controller

Create

sync()

getCurrentUser()

Only

- Receive request
- Call Service
- Return response

---

# Business Rules

- One Clerk account = One User
- Email must be unique
- ClerkId must be unique
- Never trust frontend userId
- Always use authenticated user

---

# Validation

Validate

Name

Email

Image URL

---

# Security

Protected Routes

Require Clerk authentication.

Never expose Clerk Secret.

Never trust request body userId.

---

# Deliverables

✅ Clerk Connected

✅ Auth Middleware

✅ User Sync

✅ Protected Routes

✅ Current User API

---

# AI Execution Prompt

Implement the Authentication Module.

Requirements:

- Use Express.js and JavaScript.
- Integrate Clerk.
- Create auth middleware.
- Implement POST /auth/sync.
- Implement GET /auth/me.
- Sync user with PostgreSQL.
- Follow Route → Controller → Service → Repository architecture.
- Do not implement any other modules.

---

# Success Criteria

✓ Login works

✓ User created automatically

✓ Existing user reused

✓ Protected routes work

✓ Current user endpoint works