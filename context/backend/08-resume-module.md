# 08 Resume Module

## Goal

Allow authenticated users to upload, manage, and delete resumes. Store resume metadata in PostgreSQL and files in Cloudinary.

---

## Tech Stack

- Express.js
- Prisma ORM
- PostgreSQL
- Cloudinary
- Multer
- Zod

---

## Responsibilities

- Upload resume
- Replace existing resume
- Delete resume
- Fetch user's resumes
- Validate file type and size
- Ensure ownership

---

## Folder Structure

src/
├── controllers/
│   └── resume.controller.ts
├── services/
│   └── resume.service.ts
├── repositories/
│   └── resume.repository.ts
├── routes/
│   └── resume.routes.ts
├── validations/
│   └── resume.validation.ts
├── middleware/
│   └── upload.middleware.ts
└── utils/
    └── cloudinary.ts

---

## Database Fields

Resume

- id
- userId
- fileName
- originalName
- fileUrl
- publicId
- fileSize
- mimeType
- uploadedAt
- updatedAt

---

## API Endpoints

POST   /api/v1/resumes

GET    /api/v1/resumes

GET    /api/v1/resumes/:id

PATCH  /api/v1/resumes/:id

DELETE /api/v1/resumes/:id

---

## Upload Flow

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

Return Resume

---

## Validation

Allowed Types

- PDF

Max Size

- 5 MB (configurable)

Reject:

- Invalid file type
- Oversized files
- Missing file

---

## Repository Methods

createResume()

findById()

findByUserId()

updateResume()

deleteResume()

---

## Service Methods

uploadResume()

getResume()

listResumes()

replaceResume()

deleteResume()

---

## Controller Methods

upload()

get()

list()

replace()

remove()

---

## Business Rules

- User must be authenticated.
- User can manage only their own resumes.
- Delete old Cloudinary file before replacing.
- Store only metadata in PostgreSQL.
- Never store files locally.

---

## Security

- Verify ownership.
- Validate MIME type.
- Validate file size.
- Prevent path traversal.
- Delete orphan Cloudinary files.

---

## Deliverables

✅ Cloudinary Configuration

✅ Multer Middleware

✅ Resume Repository

✅ Resume Service

✅ Resume Controller

✅ Resume Routes

✅ Resume Validation

---

## AI Execution Prompt

Implement the Resume Module.

Requirements:

- Upload PDFs using Multer.
- Store files in Cloudinary.
- Save metadata in PostgreSQL using Prisma.
- Implement CRUD operations.
- Delete Cloudinary file when deleting/replacing a resume.
- Follow Controller → Service → Repository architecture.
- Use authenticated user from req.user.
- Validate requests using Zod.

---

## Success Criteria

- Resume uploads successfully.
- File stored in Cloudinary.
- Metadata stored in PostgreSQL.
- Users access only their own resumes.
- Replace and delete operations work correctly.
- No local file storage.
- ESLint and TypeScript pass.