# 07-user-module.md

# User Module

## Brief

Manage the authenticated user's profile information.

Authentication and user synchronization are already handled by the Authentication Module. This module only retrieves and updates profile data.

---

# Goal

Implement user profile management.

---

# Prerequisites

✅ Authentication Module

✅ User Table

---

# Folder Structure

src/

controllers/
    user.controller.js

services/
    user.service.js

repositories/
    user.repository.js

routes/
    user.routes.js

validations/
    user.validation.js

---

# Database

Table

User

Fields

id

clerkId

name

email

imageUrl

createdAt

updatedAt

---

# Routes

GET /api/v1/users/me

Description

Return authenticated user's profile.

Authentication

Required

---

PATCH /api/v1/users/me

Description

Update authenticated user's profile.

Authentication

Required

Request

{
    "name": "",
    "imageUrl": ""
}

---

# Repository

Methods

findById()

updateProfile()

---

# Service

Methods

getCurrentUser()

updateProfile()

Responsibilities

- Get authenticated user
- Update profile
- Validate input

---

# Controller

Methods

getCurrentUser()

updateProfile()

---

# Validation

Name

- Required
- 2–50 characters

Image URL

- Optional
- Valid URL

---

# Business Rules

- User can update only their own profile.
- Email cannot be updated.
- ClerkId cannot be updated.
- Always use req.currentUser.id.
- Never accept userId from the client.

---

# Security

- Authentication required.
- Authorization required.
- Validate all input.

---

# Deliverables

✅ GET /users/me

✅ PATCH /users/me

✅ Validation

✅ Authorization

---

# AI Execution Prompt

Implement the User Module.

Requirements

- Use JavaScript (ES Modules).
- Create user routes, controller, service, repository, and validation.
- Implement GET /api/v1/users/me.
- Implement PATCH /api/v1/users/me.
- Use authenticated user from auth middleware.
- Follow Route → Controller → Service → Repository architecture.
- Do not implement Resume or Interview modules.

---

# Success Criteria

✓ Current user returned

✓ Profile updated

✓ Validation working

✓ Authorization working

✓ Ready for Resume Module