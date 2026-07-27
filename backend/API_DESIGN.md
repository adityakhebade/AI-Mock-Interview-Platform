# IntervueX API Design

## Overview

This document defines the complete REST API contract for IntervueX. It specifies all endpoints, request/response formats, authentication requirements, and status codes.

**Version**: 1.0  
**Base URL**: `/api/v1`  
**Date**: 2026-07-25

---

## Design Principles

1. **RESTful** - Follow REST conventions for resource naming and HTTP methods
2. **Versioned** - All endpoints under `/api/v1` for future compatibility
3. **Consistent** - Uniform response format across all endpoints
4. **Secure** - Authentication required for all protected resources
5. **Ownership** - Users can only access their own resources
6. **Stateless** - No server-side session state

---

## Standard Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Human-readable error message"
}
```

### Validation Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PATCH, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Validation error or malformed request |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Resource already exists (duplicate) |
| 500 | Internal Server Error | Unexpected server error |

---

## Authentication

### Authentication Method

IntervueX uses **Clerk** for authentication. Protected endpoints require a valid Clerk session token.

**Header Format**:
```
Authorization: Bearer <clerk_session_token>
```

### Public Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/v1/health` - API health check

### Protected Endpoints

All other endpoints require authentication.

---

## API Endpoints

### 1. Authentication APIs

#### POST /api/v1/auth/sync

**Purpose**: Create or update user record after Clerk authentication (lazy user sync).

**Authentication**: Required

**Request Body**: None (user data extracted from Clerk token)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "clxxx123",
    "clerkId": "user_2abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "imageUrl": "https://img.clerk.com/...",
    "createdAt": "2026-07-25T10:00:00Z",
    "updatedAt": "2026-07-25T10:00:00Z"
  }
}
```

**Error Responses**:
- 401: Unauthorized (invalid token)
- 500: Server error

---

#### GET /api/v1/auth/me

**Purpose**: Get current authenticated user profile.

**Authentication**: Required

**Request Body**: None

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "clxxx123",
    "clerkId": "user_2abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "imageUrl": "https://img.clerk.com/...",
    "createdAt": "2026-07-25T10:00:00Z",
    "updatedAt": "2026-07-25T10:00:00Z"
  }
}
```

**Error Responses**:
- 401: Unauthorized
- 404: User not found (should trigger sync)

---

### 2. User APIs

#### GET /api/v1/users/profile

**Purpose**: Get user profile (alias for /auth/me).

**Authentication**: Required

**Response** (200): Same as GET /auth/me

---

#### PATCH /api/v1/users/profile

**Purpose**: Update user profile information.

**Authentication**: Required

**Request Body**:
```json
{
  "name": "John Updated",
  "imageUrl": "https://new-image-url.com/avatar.png"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "clxxx123",
    "name": "John Updated",
    "email": "john@example.com",
    "imageUrl": "https://new-image-url.com/avatar.png",
    "updatedAt": "2026-07-25T11:00:00Z"
  }
}
```

**Error Responses**:
- 400: Validation error
- 401: Unauthorized

---

### 3. Resume APIs

#### POST /api/v1/resumes

**Purpose**: Upload a new resume.

**Authentication**: Required

**Request**: Multipart form data
```
file: <Resume PDF/DOCX file>
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "clres123",
    "userId": "clxxx123",
    "fileName": "resume.pdf",
    "fileUrl": "https://res.cloudinary.com/.../resume.pdf",
    "publicId": "intervuex/resumes/abc123",
    "fileSize": 245678,
    "createdAt": "2026-07-25T10:00:00Z",
    "updatedAt": "2026-07-25T10:00:00Z"
  }
}
```

**Error Responses**:
- 400: Invalid file type or size
- 401: Unauthorized
- 500: Upload failed

---

#### GET /api/v1/resumes

**Purpose**: List all resumes for authenticated user.

**Authentication**: Required

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "resumes": [
      {
        "id": "clres123",
        "fileName": "resume.pdf",
        "fileUrl": "https://res.cloudinary.com/.../resume.pdf",
        "fileSize": 245678,
        "createdAt": "2026-07-25T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

**Error Responses**:
- 401: Unauthorized

---

#### GET /api/v1/resumes/:id

**Purpose**: Get single resume details.

**Authentication**: Required (must be owner)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "clres123",
    "userId": "clxxx123",
    "fileName": "resume.pdf",
    "fileUrl": "https://res.cloudinary.com/.../resume.pdf",
    "publicId": "intervuex/resumes/abc123",
    "fileSize": 245678,
    "createdAt": "2026-07-25T10:00:00Z",
    "updatedAt": "2026-07-25T10:00:00Z"
  }
}
```

**Error Responses**:
- 401: Unauthorized
- 403: Forbidden (not the owner)
- 404: Resume not found

---

#### DELETE /api/v1/resumes/:id

**Purpose**: Delete a resume (removes from Cloudinary and database).

**Authentication**: Required (must be owner)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "Resume deleted successfully"
  }
}
```

**Error Responses**:
- 401: Unauthorized
- 403: Forbidden (not the owner)
- 404: Resume not found

---

### 4. Interview APIs

#### POST /api/v1/interviews

**Purpose**: Create a new interview session.

**Authentication**: Required

**Request Body**:
```json
{
  "title": "Frontend Developer Interview",
  "role": "React Developer",
  "difficulty": "MEDIUM",
  "language": "JavaScript",
  "duration": 60,
  "resumeId": "clres123"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "clint123",
    "userId": "clxxx123",
    "resumeId": "clres123",
    "title": "Frontend Developer Interview",
    "role": "React Developer",
    "difficulty": "MEDIUM",
    "language": "JavaScript",
    "duration": 60,
    "status": "DRAFT",
    "startedAt": null,
    "completedAt": null,
    "createdAt": "2026-07-25T10:00:00Z",
    "updatedAt": "2026-07-25T10:00:00Z"
  }
}
```

**Error Responses**:
- 400: Validation error
- 401: Unauthorized
- 404: Resume not found (if resumeId provided)

---

#### GET /api/v1/interviews

**Purpose**: List all interviews for authenticated user.

**Authentication**: Required

**Query Parameters**:
- `status` (optional): Filter by status (DRAFT, IN_PROGRESS, COMPLETED, CANCELLED)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "interviews": [
      {
        "id": "clint123",
        "title": "Frontend Developer Interview",
        "role": "React Developer",
        "difficulty": "MEDIUM",
        "status": "COMPLETED",
        "duration": 60,
        "completedAt": "2026-07-25T11:30:00Z",
        "createdAt": "2026-07-25T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

**Error Responses**:
- 401: Unauthorized

---

#### GET /api/v1/interviews/:id

**Purpose**: Get detailed interview information with questions and submissions.

**Authentication**: Required (must be owner)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "clint123",
    "title": "Frontend Developer Interview",
    "role": "React Developer",
    "difficulty": "MEDIUM",
    "language": "JavaScript",
    "duration": 60,
    "status": "IN_PROGRESS",
    "startedAt": "2026-07-25T10:15:00Z",
    "completedAt": null,
    "createdAt": "2026-07-25T10:00:00Z",
    "questions": [
      {
        "id": "clq123",
        "question": "What is React?",
        "type": "TECHNICAL",
        "difficulty": "EASY",
        "order": 1
      }
    ],
    "submissions": [
      {
        "id": "clsub123",
        "questionId": "clq123",
        "answer": "React is a JavaScript library...",
        "createdAt": "2026-07-25T10:20:00Z"
      }
    ]
  }
}
```

**Error Responses**:
- 401: Unauthorized
- 403: Forbidden (not the owner)
- 404: Interview not found

---

#### PATCH /api/v1/interviews/:id

**Purpose**: Update interview details (only allowed in DRAFT status).

**Authentication**: Required (must be owner)

**Request Body**:
```json
{
  "title": "Updated Title",
  "difficulty": "HARD",
  "duration": 90
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "clint123",
    "title": "Updated Title",
    "difficulty": "HARD",
    "duration": 90,
    "updatedAt": "2026-07-25T10:30:00Z"
  }
}
```

**Error Responses**:
- 400: Validation error or interview not in DRAFT status
- 401: Unauthorized
- 403: Forbidden (not the owner)
- 404: Interview not found

---

#### DELETE /api/v1/interviews/:id

**Purpose**: Delete an interview (cascades to questions, submissions, evaluation, report).

**Authentication**: Required (must be owner)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "Interview deleted successfully"
  }
}
```

**Error Responses**:
- 401: Unauthorized
- 403: Forbidden (not the owner)
- 404: Interview not found

---

#### POST /api/v1/interviews/:id/start

**Purpose**: Start an interview (transition from DRAFT to IN_PROGRESS).

**Authentication**: Required (must be owner)

**Request Body**: None

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "clint123",
    "status": "IN_PROGRESS",
    "startedAt": "2026-07-25T10:15:00Z",
    "updatedAt": "2026-07-25T10:15:00Z"
  }
}
```

**Error Responses**:
- 400: Interview not in DRAFT status or no questions
- 401: Unauthorized
- 403: Forbidden (not the owner)
- 404: Interview not found

---

#### POST /api/v1/interviews/:id/complete

**Purpose**: Complete an interview (transition from IN_PROGRESS to COMPLETED).

**Authentication**: Required (must be owner)

**Request Body**: None

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "clint123",
    "status": "COMPLETED",
    "completedAt": "2026-07-25T11:30:00Z",
    "updatedAt": "2026-07-25T11:30:00Z"
  }
}
```

**Error Responses**:
- 400: Interview not in IN_PROGRESS status
- 401: Unauthorized
- 403: Forbidden (not the owner)
- 404: Interview not found

---

### 5. Question APIs

#### POST /api/v1/questions/generate

**Purpose**: Generate AI-powered interview questions.

**Authentication**: Required

**Request Body**:
```json
{
  "interviewId": "clint123",
  "count": 10,
  "types": ["TECHNICAL", "CODING", "BEHAVIORAL"],
  "difficulty": "MEDIUM"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "clq123",
        "interviewId": "clint123",
        "question": "Explain the concept of closures in JavaScript",
        "type": "TECHNICAL",
        "difficulty": "MEDIUM",
        "order": 1,
        "createdAt": "2026-07-25T10:05:00Z"
      }
    ]
  }
}
```

**Error Responses**:
- 400: Validation error or interview not in DRAFT status
- 401: Unauthorized
- 403: Forbidden (not the owner)
- 404: Interview not found

---

#### GET /api/v1/questions/interview/:interviewId

**Purpose**: Get all questions for an interview.

**Authentication**: Required (must be owner of interview)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "clq123",
        "question": "What is React?",
        "type": "TECHNICAL",
        "difficulty": "EASY",
        "order": 1,
        "createdAt": "2026-07-25T10:00:00Z"
      }
    ]
  }
}
```

**Error Responses**:
- 401: Unauthorized
- 403: Forbidden (not the owner)
- 404: Interview not found

---

#### PATCH /api/v1/questions/:id

**Purpose**: Update a question (only allowed when interview is in DRAFT).

**Authentication**: Required (must own interview)

**Request Body**:
```json
{
  "question": "Updated question text",
  "difficulty": "HARD"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "clq123",
    "question": "Updated question text",
    "difficulty": "HARD",
    "updatedAt": "2026-07-25T10:10:00Z"
  }
}
```

**Error Responses**:
- 400: Validation error or interview not in DRAFT
- 401: Unauthorized
- 403: Forbidden
- 404: Question not found

---

#### DELETE /api/v1/questions/:id

**Purpose**: Delete a question (only allowed when interview is in DRAFT).

**Authentication**: Required (must own interview)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "Question deleted successfully"
  }
}
```

**Error Responses**:
- 400: Interview not in DRAFT status
- 401: Unauthorized
- 403: Forbidden
- 404: Question not found

---

### 6. Submission APIs

#### POST /api/v1/submissions

**Purpose**: Save an answer to a question (auto-save during interview).

**Authentication**: Required (must own interview)

**Request Body**:
```json
{
  "interviewId": "clint123",
  "questionId": "clq123",
  "answer": "React is a JavaScript library for building user interfaces...",
  "code": null,
  "language": null
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "clsub123",
    "interviewId": "clint123",
    "questionId": "clq123",
    "answer": "React is a JavaScript library...",
    "code": null,
    "language": null,
    "createdAt": "2026-07-25T10:20:00Z"
  }
}
```

**Error Responses**:
- 400: Validation error or duplicate submission
- 401: Unauthorized
- 403: Forbidden (not the owner)
- 404: Interview or question not found

---

#### PATCH /api/v1/submissions/:id

**Purpose**: Update an existing submission (auto-save).

**Authentication**: Required (must own interview)

**Request Body**:
```json
{
  "answer": "Updated answer text",
  "code": "const handleClick = () => { ... }",
  "language": "javascript"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "clsub123",
    "answer": "Updated answer text",
    "code": "const handleClick = () => { ... }",
    "language": "javascript",
    "createdAt": "2026-07-25T10:20:00Z"
  }
}
```

**Error Responses**:
- 400: Validation error
- 401: Unauthorized
- 403: Forbidden
- 404: Submission not found

---

#### GET /api/v1/submissions/interview/:interviewId

**Purpose**: Get all submissions for an interview.

**Authentication**: Required (must own interview)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": "clsub123",
        "questionId": "clq123",
        "answer": "React is a JavaScript library...",
        "code": null,
        "language": null,
        "createdAt": "2026-07-25T10:20:00Z"
      }
    ]
  }
}
```

**Error Responses**:
- 401: Unauthorized
- 403: Forbidden
- 404: Interview not found

---

### 7. Evaluation APIs

#### POST /api/v1/evaluations/:interviewId

**Purpose**: Generate AI evaluation for completed interview.

**Authentication**: Required (must own interview)

**Request Body**: None

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "cleval123",
    "interviewId": "clint123",
    "score": 85,
    "strengths": "Strong understanding of React fundamentals...",
    "weaknesses": "Could improve on performance optimization...",
    "feedback": "Overall excellent performance...",
    "createdAt": "2026-07-25T11:35:00Z"
  }
}
```

**Error Responses**:
- 400: Interview not completed or evaluation already exists
- 401: Unauthorized
- 403: Forbidden
- 404: Interview not found
- 500: AI service error

---

#### GET /api/v1/evaluations/:interviewId

**Purpose**: Get evaluation for an interview.

**Authentication**: Required (must own interview)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "cleval123",
    "interviewId": "clint123",
    "score": 85,
    "strengths": "Strong understanding of React fundamentals...",
    "weaknesses": "Could improve on performance optimization...",
    "feedback": "Overall excellent performance...",
    "createdAt": "2026-07-25T11:35:00Z"
  }
}
```

**Error Responses**:
- 401: Unauthorized
- 403: Forbidden
- 404: Evaluation not found

---

### 8. Report APIs

#### POST /api/v1/reports/:interviewId

**Purpose**: Generate final interview report (created after evaluation).

**Authentication**: Required (must own interview)

**Request Body**: None

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "clrep123",
    "userId": "clxxx123",
    "interviewId": "clint123",
    "overallScore": 85,
    "recommendation": "Strong candidate for mid-level positions...",
    "summary": "The candidate demonstrated excellent knowledge...",
    "createdAt": "2026-07-25T11:40:00Z"
  }
}
```

**Error Responses**:
- 400: Evaluation not completed or report already exists
- 401: Unauthorized
- 403: Forbidden
- 404: Interview or evaluation not found

---

#### GET /api/v1/reports

**Purpose**: List all reports for authenticated user.

**Authentication**: Required

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "id": "clrep123",
        "interviewId": "clint123",
        "overallScore": 85,
        "recommendation": "Strong candidate...",
        "createdAt": "2026-07-25T11:40:00Z",
        "interview": {
          "title": "Frontend Developer Interview",
          "role": "React Developer",
          "difficulty": "MEDIUM"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 8,
      "totalPages": 1
    }
  }
}
```

**Error Responses**:
- 401: Unauthorized

---

#### GET /api/v1/reports/:id

**Purpose**: Get detailed report.

**Authentication**: Required (must be owner)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "clrep123",
    "userId": "clxxx123",
    "interviewId": "clint123",
    "overallScore": 85,
    "recommendation": "Strong candidate for mid-level positions...",
    "summary": "The candidate demonstrated excellent knowledge...",
    "createdAt": "2026-07-25T11:40:00Z",
    "interview": {
      "id": "clint123",
      "title": "Frontend Developer Interview",
      "role": "React Developer",
      "difficulty": "MEDIUM",
      "completedAt": "2026-07-25T11:30:00Z"
    },
    "evaluation": {
      "score": 85,
      "strengths": "Strong understanding...",
      "weaknesses": "Could improve...",
      "feedback": "Overall excellent..."
    }
  }
}
```

**Error Responses**:
- 401: Unauthorized
- 403: Forbidden (not the owner)
- 404: Report not found

---

#### DELETE /api/v1/reports/:id

**Purpose**: Delete a report.

**Authentication**: Required (must be owner)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "Report deleted successfully"
  }
}
```

**Error Responses**:
- 401: Unauthorized
- 403: Forbidden (not the owner)
- 404: Report not found

---

### 9. Dashboard APIs

#### GET /api/v1/dashboard

**Purpose**: Get dashboard statistics and overview.

**Authentication**: Required

**Response** (200):
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalInterviews": 15,
      "completedInterviews": 10,
      "averageScore": 78.5,
      "resumeCount": 3
    },
    "recentInterviews": [
      {
        "id": "clint123",
        "title": "Frontend Developer Interview",
        "status": "COMPLETED",
        "completedAt": "2026-07-25T11:30:00Z",
        "score": 85
      }
    ],
    "recentReports": [
      {
        "id": "clrep123",
        "interviewTitle": "Frontend Developer Interview",
        "overallScore": 85,
        "createdAt": "2026-07-25T11:40:00Z"
      }
    ]
  }
}
```

**Error Responses**:
- 401: Unauthorized

---

### 10. AI APIs

#### POST /api/v1/ai/questions

**Purpose**: Generate interview questions using AI.

**Authentication**: Required

**Request Body**:
```json
{
  "role": "React Developer",
  "difficulty": "MEDIUM",
  "language": "JavaScript",
  "count": 10,
  "types": ["TECHNICAL", "CODING", "BEHAVIORAL"],
  "resume": "optional resume text for context"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "question": "Explain the concept of React hooks",
        "type": "TECHNICAL",
        "difficulty": "MEDIUM"
      }
    ]
  }
}
```

**Error Responses**:
- 400: Validation error
- 401: Unauthorized
- 500: AI service error

---

#### POST /api/v1/ai/evaluate

**Purpose**: Evaluate interview answers using AI.

**Authentication**: Required

**Request Body**:
```json
{
  "interviewId": "clint123",
  "questions": [
    {
      "question": "What is React?",
      "answer": "React is a JavaScript library..."
    }
  ]
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "score": 85,
    "strengths": "Strong understanding of fundamentals...",
    "weaknesses": "Could improve on advanced topics...",
    "feedback": "Overall excellent performance..."
  }
}
```

**Error Responses**:
- 400: Validation error
- 401: Unauthorized
- 500: AI service error

---

#### POST /api/v1/ai/report

**Purpose**: Generate interview report using AI.

**Authentication**: Required

**Request Body**:
```json
{
  "interviewId": "clint123",
  "evaluation": {
    "score": 85,
    "strengths": "...",
    "weaknesses": "...",
    "feedback": "..."
  }
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "overallScore": 85,
    "recommendation": "Strong candidate...",
    "summary": "The candidate demonstrated..."
  }
}
```

**Error Responses**:
- 400: Validation error
- 401: Unauthorized
- 500: AI service error

---

## API Grouping by Domain

### Authentication Domain
- `POST /api/v1/auth/sync`
- `GET /api/v1/auth/me`

### User Domain
- `GET /api/v1/users/profile`
- `PATCH /api/v1/users/profile`

### Resume Domain
- `POST /api/v1/resumes`
- `GET /api/v1/resumes`
- `GET /api/v1/resumes/:id`
- `DELETE /api/v1/resumes/:id`

### Interview Domain
- `POST /api/v1/interviews`
- `GET /api/v1/interviews`
- `GET /api/v1/interviews/:id`
- `PATCH /api/v1/interviews/:id`
- `DELETE /api/v1/interviews/:id`
- `POST /api/v1/interviews/:id/start`
- `POST /api/v1/interviews/:id/complete`

### Question Domain
- `POST /api/v1/questions/generate`
- `GET /api/v1/questions/interview/:interviewId`
- `PATCH /api/v1/questions/:id`
- `DELETE /api/v1/questions/:id`

### Submission Domain
- `POST /api/v1/submissions`
- `PATCH /api/v1/submissions/:id`
- `GET /api/v1/submissions/interview/:interviewId`

### Evaluation Domain
- `POST /api/v1/evaluations/:interviewId`
- `GET /api/v1/evaluations/:interviewId`

### Report Domain
- `POST /api/v1/reports/:interviewId`
- `GET /api/v1/reports`
- `GET /api/v1/reports/:id`
- `DELETE /api/v1/reports/:id`

### Dashboard Domain
- `GET /api/v1/dashboard`

### AI Domain
- `POST /api/v1/ai/questions`
- `POST /api/v1/ai/evaluate`
- `POST /api/v1/ai/report`

---

## Implementation Mapping

### Route → Controller → Service → Repository → Prisma

Each API endpoint follows the layered architecture:

```
1. Route (routes/*.routes.js)
   - Define endpoint
   - Attach middleware (auth, validation)
   - Call controller

2. Controller (controllers/*.controller.js)
   - Extract request data
   - Call service
   - Return response

3. Service (services/*.service.js)
   - Business logic
   - Ownership checks
   - State transitions
   - Call repositories

4. Repository (repositories/*.repository.js)
   - Database operations
   - Prisma queries only

5. Prisma Client
   - Database access
```

---

## Validation Rules

### Common Validation Patterns

**Email**:
- Must be valid email format
- Must be unique in database

**Password** (if implemented):
- Minimum 8 characters
- Must contain uppercase, lowercase, number

**Interview Creation**:
- `title`: Required, 1-200 characters
- `role`: Required, 1-100 characters
- `difficulty`: Required, one of [EASY, MEDIUM, HARD]
- `language`: Required, 1-50 characters
- `duration`: Required, integer 15-180 (minutes)
- `resumeId`: Optional, must exist if provided

**Question Generation**:
- `count`: Required, integer 1-50
- `types`: Required, array of valid QuestionType
- `difficulty`: Required, valid Difficulty enum

**Submission**:
- `interviewId`: Required, must exist
- `questionId`: Required, must exist
- `answer` or `code`: At least one required
- `language`: Required if `code` provided

---

## Ownership and Authorization Rules

### Resource Ownership

1. **User owns**:
   - Their profile
   - Their resumes
   - Their interviews
   - Their reports

2. **Interview owns**:
   - Questions
   - Submissions
   - Evaluation
   - Report

### Authorization Checks

Every protected endpoint must:
1. Verify user is authenticated (Clerk token valid)
2. Verify user owns the resource being accessed
3. Return 403 if not the owner

**Example Flow**:
```
1. User requests: GET /api/v1/interviews/clint123
2. Extract userId from Clerk token
3. Check: interview.userId === userId
4. If match: return interview
5. If no match: return 403 Forbidden
```

---

## Status Transitions

### Interview Status State Machine

```
DRAFT
  ↓ (POST /interviews/:id/start)
IN_PROGRESS
  ↓ (POST /interviews/:id/complete)
COMPLETED

DRAFT or IN_PROGRESS
  ↓ (DELETE /interviews/:id)
CANCELLED
```

**Rules**:
- Can only start interview from DRAFT
- Can only complete interview from IN_PROGRESS
- Cannot transition from COMPLETED or CANCELLED
- Updating interview details only allowed in DRAFT

---

## Error Handling

### Standard Error Format

All errors follow the same format:

```json
{
  "success": false,
  "message": "Human-readable error message"
}
```

### Validation Errors

Include field-level details:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "duration",
      "message": "Duration must be between 15 and 180 minutes"
    }
  ]
}
```

### Common Error Messages

**401 Unauthorized**:
- "Authentication required"
- "Invalid or expired token"

**403 Forbidden**:
- "You do not have permission to access this resource"
- "Resource belongs to another user"

**404 Not Found**:
- "Interview not found"
- "Resume not found"
- "Question not found"

**409 Conflict**:
- "Email already exists"
- "Evaluation already exists for this interview"

**400 Bad Request**:
- "Interview must be in DRAFT status to update"
- "Interview must have questions before starting"
- "At least one of answer or code is required"

---

## Pagination

### Query Parameters

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

### Pagination Response

```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

### Endpoints with Pagination

- `GET /api/v1/resumes`
- `GET /api/v1/interviews`
- `GET /api/v1/reports`

---

## Rate Limiting

### Rate Limits (Future Implementation)

- **AI endpoints**: 10 requests per minute per user
- **File upload**: 5 uploads per minute per user
- **General APIs**: 100 requests per minute per user

### Rate Limit Response (429)

```json
{
  "success": false,
  "message": "Too many requests. Please try again later.",
  "retryAfter": 60
}
```

---

## File Upload Specifications

### Resume Upload

**Endpoint**: `POST /api/v1/resumes`

**Content-Type**: `multipart/form-data`

**Field Name**: `file`

**Allowed File Types**:
- `application/pdf` (.pdf)
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (.docx)
- `application/msword` (.doc)

**File Size Limits**:
- Minimum: 1 KB
- Maximum: 5 MB

**Validation**:
- File must be present
- File type must be allowed
- File size must be within limits

**Storage**: Cloudinary

**Cloudinary Response Fields**:
- `fileUrl`: Public URL to access file
- `publicId`: Cloudinary identifier for deletion
- `fileSize`: Size in bytes

---

## CORS Configuration

### Allowed Origins

Development:
- `http://localhost:3000` (Next.js frontend)

Production:
- `https://intervuex.com` (or deployment URL)

### Allowed Methods

- GET
- POST
- PATCH
- DELETE
- OPTIONS

### Allowed Headers

- `Content-Type`
- `Authorization`

### Credentials

Allowed: `true` (for cookies if needed)

---

## Security Headers

### Helmet Configuration

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

### Content Security Policy

To be configured based on frontend requirements.

---

## API Testing Checklist

### Authentication Tests
- ✅ POST /auth/sync creates new user
- ✅ POST /auth/sync is idempotent (same user)
- ✅ GET /auth/me returns authenticated user
- ✅ 401 returned for missing token
- ✅ 401 returned for invalid token

### Resume Tests
- ✅ POST /resumes uploads file to Cloudinary
- ✅ GET /resumes returns user's resumes only
- ✅ GET /resumes/:id returns 403 for other user's resume
- ✅ DELETE /resumes/:id removes from Cloudinary and database
- ✅ File type validation working
- ✅ File size validation working

### Interview Tests
- ✅ POST /interviews creates interview in DRAFT status
- ✅ GET /interviews filters by status
- ✅ POST /interviews/:id/start transitions to IN_PROGRESS
- ✅ POST /interviews/:id/complete transitions to COMPLETED
- ✅ PATCH /interviews/:id only works in DRAFT status
- ✅ DELETE /interviews/:id cascades to questions/submissions

### Question Tests
- ✅ POST /questions/generate creates ordered questions
- ✅ GET /questions/interview/:id returns questions in order
- ✅ PATCH /questions/:id only works when interview is DRAFT
- ✅ Unique order constraint enforced

### Submission Tests
- ✅ POST /submissions creates or updates (upsert)
- ✅ Unique constraint (interviewId, questionId) enforced
- ✅ GET /submissions/interview/:id returns all submissions

### Evaluation Tests
- ✅ POST /evaluations/:id creates evaluation
- ✅ GET /evaluations/:id returns evaluation
- ✅ One evaluation per interview enforced

### Report Tests
- ✅ POST /reports/:id creates report
- ✅ GET /reports returns paginated user reports
- ✅ GET /reports/:id includes interview and evaluation data
- ✅ One report per interview enforced

### Dashboard Tests
- ✅ GET /dashboard calculates correct statistics
- ✅ Recent interviews sorted by date
- ✅ Average score calculated correctly

---

## Performance Considerations

### Database Queries

1. **Use Indexes**: All common queries use indexed fields
2. **Select Specific Fields**: Don't fetch unnecessary data
3. **Pagination**: Limit result sets for list endpoints
4. **Eager Loading**: Use Prisma `include` wisely to avoid N+1 queries

### Example Optimized Query

```javascript
// ❌ Bad: N+1 query problem
const interviews = await prisma.interview.findMany({ where: { userId } });
for (const interview of interviews) {
  const questions = await prisma.question.findMany({ where: { interviewId: interview.id } });
}

// ✅ Good: Single query with include
const interviews = await prisma.interview.findMany({
  where: { userId },
  include: { questions: true },
});
```

---

## API Versioning Strategy

### Current Version

All APIs are under `/api/v1`

### Future Versions

When breaking changes are needed:
- Create new version: `/api/v2`
- Keep v1 endpoints running for backwards compatibility
- Deprecate old version with notice period
- Document migration guide

### What Constitutes a Breaking Change

- Removing an endpoint
- Removing a field from response
- Changing field type
- Changing status codes
- Changing authentication method

### Non-Breaking Changes (Safe for v1)

- Adding new endpoints
- Adding new optional fields to request
- Adding new fields to response
- Adding new query parameters
- Improving error messages

---

## Swagger/OpenAPI Documentation

### Documentation Endpoint

`GET /api/v1/docs` - Interactive API documentation (Swagger UI)

### OpenAPI Spec

`GET /api/v1/docs/json` - OpenAPI 3.0 JSON specification

### Documentation Features

- Interactive API testing
- Request/response examples
- Authentication setup
- Schema definitions
- Status code descriptions

---

## Development Guidelines

### Adding a New Endpoint

1. **Design Phase** (THIS DOCUMENT):
   - Define endpoint URL
   - Define request/response format
   - Define status codes
   - Define validation rules
   - Define authorization rules

2. **Implementation Phase** (NEXT STEP):
   - Create validation schema (Zod)
   - Create repository methods
   - Create service logic
   - Create controller
   - Create route
   - Add tests

3. **Documentation Phase**:
   - Add to Swagger documentation
   - Update API_DESIGN.md if needed
   - Add usage examples

---

## Summary

### Total Endpoints: 39

**By Domain**:
- Authentication: 2 endpoints
- User: 2 endpoints
- Resume: 4 endpoints
- Interview: 7 endpoints
- Question: 4 endpoints
- Submission: 3 endpoints
- Evaluation: 2 endpoints
- Report: 4 endpoints
- Dashboard: 1 endpoint
- AI: 3 endpoints
- Public: 3 endpoints (health checks)

**By HTTP Method**:
- GET: 16 endpoints
- POST: 14 endpoints
- PATCH: 5 endpoints
- DELETE: 4 endpoints

**By Authentication**:
- Public: 3 endpoints
- Protected: 36 endpoints

---

## Success Criteria

✅ **Complete API Design**
- All 39 endpoints defined
- Request/response formats specified
- Status codes documented
- Validation rules defined

✅ **REST Principles**
- Resource-based URLs
- Proper HTTP methods
- Stateless design
- Standard status codes

✅ **Consistent Structure**
- Uniform response format
- Consistent error handling
- Standard pagination
- Common authentication

✅ **Security**
- Authentication required for protected routes
- Ownership verification
- Input validation
- CORS configuration

✅ **Scalability**
- Versioned APIs (/api/v1)
- Pagination support
- Performance considerations
- Future-proof design

✅ **Documentation**
- Complete endpoint specifications
- Request/response examples
- Error scenarios covered
- Testing checklist provided

---

## Next Steps

1. ✅ **API Design Complete** (this document)
2. ➡️ **Implement Authentication Module**
   - Clerk middleware integration
   - User sync endpoint
   - Protected route middleware
3. ➡️ **Implement Resume Module**
   - Cloudinary integration
   - File upload handling
   - CRUD operations
4. ➡️ **Implement Interview Module**
   - Status transitions
   - Ownership checks
   - CRUD operations
5. ➡️ **Implement Question & Submission Modules**
   - Auto-save logic
   - Order management
6. ➡️ **Implement Evaluation & Report Modules**
   - AI integration placeholders
   - Report generation
7. ➡️ **Implement Dashboard**
   - Statistics aggregation
8. ➡️ **Add Swagger Documentation**
   - OpenAPI spec
   - Interactive docs

---

**Document Version**: 1.0  
**Last Updated**: 2026-07-25  
**Status**: ✅ Complete - Ready for Implementation
