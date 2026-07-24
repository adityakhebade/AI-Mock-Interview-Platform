# 07-user-module.md

# User Module

## Brief

Manage the authenticated user's profile.

This module allows users to:

- View profile
- Update profile
- Store profile information
- Maintain account settings

This module only works after Authentication Module is completed.

---

# Goal

Implement user profile management.

---

# Prerequisites

✅ Authentication Module

✅ Clerk Authentication

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

Fields Used

id

clerkId

name

email

imageUrl

createdAt

updatedAt

---

# Routes

GET /api/v1/users/profile

Description

Return logged-in user's profile.

Authentication

Required

---

PATCH /api/v1/users/profile

Description

Update profile.

Authentication

Required

Request

{
    "name": "",
    "imageUrl": ""
}

---

# Repository

Create Methods

findById()

updateProfile()

---

# Service

Create Methods

getProfile()

updateProfile()

Responsibilities

- Fetch authenticated user
- Update profile
- Validate ownership
- Return updated data

---

# Controller

Create Methods

getProfile()

updateProfile()

Responsibilities

- Receive request
- Call service
- Return response

---

# Validation

Validate

Name

- Required
- 2–50 characters

Image URL

- Optional
- Valid URL

---

# Business Rules

Only logged-in user can update profile.

Email cannot be changed.

ClerkId cannot be changed.

Never update another user's profile.

---

# Response

Success

{
    "success": true,
    "data": {}
}

Error

{
    "success": false,
    "message": "Profile not found"
}

---

# Security

Authentication required.

Use authenticated user ID.

Never trust user ID from frontend.

---

# Deliverables

✅ Get Profile API

✅ Update Profile API

✅ Validation

✅ Authorization

---

# AI Execution Prompt

Implement the User Module.

Requirements

- Use JavaScript (ES Modules).
- Create user routes.
- Create controllers.
- Create services.
- Create repositories.
- Implement GET /users/profile.
- Implement PATCH /users/profile.
- Use authenticated user.
- Follow Route → Controller → Service → Repository architecture.
- Do not implement Resume or Interview modules.

---

# Success Criteria

✓ User profile fetched

✓ Profile updated

✓ Validation working

✓ Authorization working

✓ Ready for Resume Module