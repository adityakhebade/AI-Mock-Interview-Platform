# 08-resume-module.md

# Resume Module

## Brief

Allow authenticated users to upload, view, update, and delete resumes. Store files in Cloudinary and metadata in PostgreSQL.

---

## Goal

Implement complete resume management.

---

## Prerequisites

✅ Authentication Module

✅ User Module

✅ Cloudinary Configured

---

# Tech Stack

- Express.js
- JavaScript (ES Modules)
- Prisma ORM
- PostgreSQL
- Multer
- Cloudinary
- Zod

---

# Folder Structure

src/

controllers/
    resume.controller.js

services/
    resume.service.js

repositories/
    resume.repository.js

routes/
    resume.routes.js

validations/
    resume.validation.js

middleware/
    upload.middleware.js

utils/
    cloudinary.js

---

# Database

Table

Resume

Fields

id

userId

fileName

originalName

fileUrl

publicId

fileSize

mimeType

uploadedAt

updatedAt

---

# Routes

POST /api/v1/resumes

Description

Upload a resume.

---

GET /api/v1/resumes

Description

Get all resumes of the logged-in user.

---

GET /api/v1/resumes/:id

Description

Get a specific resume.

---

PATCH /api/v1/resumes/:id

Description

Replace an existing resume.

---

DELETE /api/v1/resumes/:id

Description

Delete a resume.

---

# Upload Flow

User

↓

Upload PDF

↓

Multer Validation

↓

Cloudinary Upload

↓

Save Metadata in PostgreSQL

↓

Return Resume Details

---

# Validation

Allowed File Type

- PDF

Maximum Size

- 5 MB

Reject

- Missing file
- Invalid file type
- File exceeds size limit

---

# Repository

Methods

createResume()

findById()

findByUserId()

updateResume()

deleteResume()

---

# Service

Methods

uploadResume()

getResume()

listResumes()

replaceResume()

deleteResume()

Responsibilities

- Upload file to Cloudinary
- Save metadata
- Delete old Cloudinary file when replacing
- Verify ownership

---

# Controller

Methods

upload()

list()

get()

replace()

remove()

---

# Business Rules

- Authentication required.
- Users can access only their own resumes.
- Store only metadata in PostgreSQL.
- Store files only in Cloudinary.
- Delete old Cloudinary file before replacing.
- Delete Cloudinary file when deleting a resume.

---

# Security

- Verify ownership.
- Validate MIME type.
- Validate file size.
- Never trust resume ID without ownership check.

---

# Deliverables

✅ Multer Middleware

✅ Cloudinary Integration

✅ Resume Repository

✅ Resume Service

✅ Resume Controller

✅ Resume Routes

✅ Resume Validation

---

# AI Execution Prompt

Implement the Resume Module.

Requirements

- Use JavaScript (ES Modules).
- Upload PDF files using Multer.
- Store files in Cloudinary.
- Store metadata in PostgreSQL using Prisma.
- Implement CRUD operations.
- Delete Cloudinary files when replacing or deleting resumes.
- Use authenticated user from auth middleware.
- Follow Route → Controller → Service → Repository architecture.
- Validate requests using Zod.
- Do not implement Interview or AI modules.

---

# Success Criteria

✓ Resume uploaded successfully

✓ File stored in Cloudinary

✓ Metadata stored in PostgreSQL

✓ Users can access only their own resumes

✓ Replace works correctly

✓ Delete works correctly

✓ No local file storage

✓ Ready for Interview Module