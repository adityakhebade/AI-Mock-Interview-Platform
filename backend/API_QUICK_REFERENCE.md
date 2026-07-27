# IntervueX API Quick Reference

**Base URL**: `/api/v1`

## Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/sync` | Sync user from Clerk | ✅ |
| GET | `/auth/me` | Get current user | ✅ |

## User Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/profile` | Get profile | ✅ |
| PATCH | `/users/profile` | Update profile | ✅ |

## Resume Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/resumes` | Upload resume | ✅ |
| GET | `/resumes` | List user resumes | ✅ |
| GET | `/resumes/:id` | Get resume details | ✅ |
| DELETE | `/resumes/:id` | Delete resume | ✅ |

## Interview Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/interviews` | Create interview | ✅ |
| GET | `/interviews` | List interviews | ✅ |
| GET | `/interviews/:id` | Get interview details | ✅ |
| PATCH | `/interviews/:id` | Update interview | ✅ |
| DELETE | `/interviews/:id` | Delete interview | ✅ |
| POST | `/interviews/:id/start` | Start interview | ✅ |
| POST | `/interviews/:id/complete` | Complete interview | ✅ |

## Question Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/questions/generate` | Generate AI questions | ✅ |
| GET | `/questions/interview/:id` | Get interview questions | ✅ |
| PATCH | `/questions/:id` | Update question | ✅ |
| DELETE | `/questions/:id` | Delete question | ✅ |

## Submission Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/submissions` | Save answer | ✅ |
| PATCH | `/submissions/:id` | Update answer | ✅ |
| GET | `/submissions/interview/:id` | Get all answers | ✅ |

## Evaluation Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/evaluations/:interviewId` | Generate evaluation | ✅ |
| GET | `/evaluations/:interviewId` | Get evaluation | ✅ |

## Report Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/reports/:interviewId` | Generate report | ✅ |
| GET | `/reports` | List reports | ✅ |
| GET | `/reports/:id` | Get report details | ✅ |
| DELETE | `/reports/:id` | Delete report | ✅ |

## Dashboard Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/dashboard` | Get dashboard stats | ✅ |

## AI Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/ai/questions` | Generate questions | ✅ |
| POST | `/ai/evaluate` | Evaluate answers | ✅ |
| POST | `/ai/report` | Generate report | ✅ |

## Public Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Welcome message | ❌ |
| GET | `/health` | Health check | ❌ |
| GET | `/api/v1/health` | API health check | ❌ |

---

## Status Codes

- **200** - OK (GET, PATCH, DELETE success)
- **201** - Created (POST success)
- **400** - Bad Request (validation error)
- **401** - Unauthorized (auth required)
- **403** - Forbidden (not owner)
- **404** - Not Found (resource missing)
- **409** - Conflict (duplicate)
- **500** - Internal Server Error

## Response Format

### Success
```json
{
  "success": true,
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Error message"
}
```

---

**Total Endpoints**: 39  
**Protected**: 36  
**Public**: 3
