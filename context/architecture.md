# Architecture

## Overview

The AI Mock Interview Platform follows a modular, layered architecture designed for long-term scalability. The application separates the frontend and backend into independent projects, exposing a REST API for communication. Business logic is isolated from routing and database operations, making the system easier to maintain, test, and extend with future AI capabilities.

---

# Technology Stack

| Layer | Technology | Role |
|--------|------------|------|
| Frontend | Next.js | User interface and client-side application |
| Styling | Tailwind CSS | UI styling |
| UI Components | shadcn/ui + Radix UI | Reusable accessible UI components |
| Icons | Lucide React | Icon library |
| Backend | Express.js | REST API server |
| Language | JavaScript | Backend implementation |
| API | REST | Communication between frontend and backend |
| Database | PostgreSQL | Primary relational database |
| ORM | Prisma | Database access and migrations |
| Authentication | Clerk | User authentication and session management |
| Validation | Zod | Request validation |
| File Storage | Cloudinary | Resume file storage |
| Logging | Winston | Application logging |
| Documentation | Swagger/OpenAPI | Interactive API documentation |
| Security | Helmet | Secure HTTP headers |
| Security | CORS | Cross-origin access control |
| Security | Express Rate Limit | API abuse prevention |
| Performance | Compression | Compress HTTP responses |
| Testing | Jest + Supertest | Unit and integration testing |
| CI/CD | GitHub Actions | Automated testing and build pipeline |
| Code Review | CodeRabbit | Automated pull request reviews |
| Code Quality | ESLint + Prettier + Husky + lint-staged | Code quality and formatting |

---

# High-Level Architecture

```text
                    Next.js Frontend
                           │
                     REST API Calls
                           │
                    Express Backend
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   Controllers         Middleware        Swagger
        │
        ▼
     Services
        │
        ▼
   Repositories
        │
        ▼
      Prisma
        │
        ▼
   PostgreSQL Database

External Services
-----------------
Clerk
Cloudinary
```

---

# System Boundaries

## Frontend (`client/`)

Responsible for:

- User interface
- Routing
- Forms
- State management
- API communication
- Authentication UI
- Dashboard
- Interview pages

Never responsible for:

- Business logic
- Database access
- Authentication verification
- File storage logic

---

## Backend (`server/`)

Responsible for:

- REST API
- Business logic
- Authorization
- Database operations
- Validation
- Logging
- Error handling
- External service integration

---

# Backend Folder Responsibilities

| Folder | Responsibility |
|----------|----------------|
| `config/` | Environment configuration and application setup |
| `routes/` | API endpoint definitions |
| `controllers/` | Handle HTTP requests and responses |
| `services/` | Business logic |
| `repositories/` | Database operations only |
| `middleware/` | Authentication, authorization, validation, error handling |
| `validations/` | Zod request schemas |
| `prisma/` | Prisma client and database access |
| `utils/` | Shared helper functions |
| `constants/` | Application constants |
| `helpers/` | Utility helpers |
| `errors/` | Custom error classes |
| `docs/` | Swagger configuration |

---

# Layer Responsibilities

```text
Request
   │
   ▼
Route
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
Prisma
   │
   ▼
PostgreSQL
```

### Routes

Responsible for:

- Defining endpoints
- Applying middleware

Must not contain business logic.

---

### Controllers

Responsible for:

- Parsing requests
- Calling services
- Returning responses

Must not access the database directly.

---

### Services

Responsible for:

- Business rules
- Validation logic
- Workflow orchestration

Services coordinate repositories and external providers.

---

### Repositories

Responsible only for:

- Reading data
- Writing data
- Database queries

Repositories must never contain business logic.

---

# Storage Model

## PostgreSQL

Stores structured application data.

Examples:

- Users
- Interview sessions
- Questions
- Answers
- Reports
- Resume metadata
- Interview history

---

## Cloudinary

Stores uploaded files.

Examples:

- Resume PDFs
- Resume DOCX files

Only the Cloudinary URL and metadata are stored in PostgreSQL.

---

## Cache

Phase 1:

No caching layer.

Future:

Redis will be introduced for:

- AI response caching
- Background job queues
- Rate limiting
- Session caching (if required)

---

# Authentication Model

Authentication is managed by Clerk.

Flow:

```text
User
   │
   ▼
Clerk Authentication
   │
   ▼
JWT / Session
   │
   ▼
Express Middleware
   │
   ▼
Protected API
```

---

## User Ownership

Every authenticated Clerk user is synchronized with the application's `User` table.

The application owns its own user records.

Example:

```text
Clerk User
      │
      ▼
Application User
      │
      ├── Resumes
      ├── Interviews
      ├── Reports
      └── History
```

Relationships inside the application always reference the internal `User` table, not Clerk directly.

---

# Authorization Model

Users can only access resources they own.

Examples:

- Users can only view their own resumes.
- Users can only access their own interviews.
- Users can only view their own reports.

Ownership checks are enforced in the service layer.

---

# Background Tasks

## Phase 1

Simple asynchronous tasks.

Examples:

- Resume upload
- Resume deletion
- File cleanup
- Report generation

No message queue is used.

---

## Future

Background processing will migrate to:

- BullMQ
- Redis

Potential jobs:

- AI evaluations
- Resume analysis
- PDF generation
- Email delivery
- Notifications

---

# AI Architecture (Future)

AI is implemented as an independent service layer.

```text
Interview Engine
        │
        ▼
   AI Service
        │
        ├── Question Generation
        ├── Answer Evaluation
        ├── Resume Analysis
        └── Feedback
```

The interview engine must not depend directly on any AI provider.

AI providers should be replaceable without changing business logic.

---

# API Standards

Base URL:

```
/api/v1/
```

Response format:

Success

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

Error

```json
{
  "success": false,
  "message": "...",
  "errors": []
}
```

---

# Invariants

The following rules must never be violated.

## 1. Business logic belongs only in services.

Controllers, routes, and repositories must never implement business rules.

---

## 2. Controllers never access Prisma directly.

All database operations must go through repositories.

---

## 3. Repositories only perform data access.

Repositories must never contain validation, authorization, or business logic.

---

## 4. Every protected resource must verify ownership.

Users must never access another user's resumes, interviews, reports, or data.

---

## 5. Uploaded files must never be stored on the application server.

All files must be stored in Cloudinary.

---

## 6. Every incoming request must be validated.

Request bodies, parameters, and query strings must be validated using Zod before reaching business logic.

---

## 7. Every API must return the standard response format.

All endpoints must follow the same success and error response structure.

---

## 8. Secrets must never exist in source code.

Environment variables must be loaded through the centralized configuration layer.

---

## 9. Authentication is delegated to Clerk.

The application manages authorization and ownership but never stores user passwords.

---

## 10. AI features must remain isolated.

The core interview engine must continue functioning even if AI services are unavailable.