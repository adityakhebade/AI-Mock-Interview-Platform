# Evaluation Module Documentation

## Overview

The Evaluation Module manages AI-generated interview evaluation results. It stores scores, strengths, weaknesses, and detailed feedback for completed interviews.

---

## Architecture

Follows the layered architecture pattern:

```
Route → Controller → Service → Repository → Prisma → PostgreSQL
```

### Layers

1. **Routes** (`evaluation.routes.js`): Define API endpoints
2. **Controller** (`evaluation.controller.js`): Handle HTTP requests/responses
3. **Service** (`evaluation.service.js`): Business logic and validation
4. **Repository** (`evaluation.repository.js`): Database operations

---

## Database Schema

### Evaluation Model

| Field        | Type     | Description                              |
|--------------|----------|------------------------------------------|
| id           | String   | Primary key (CUID)                       |
| interviewId  | String   | Foreign key to Interview (unique)        |
| score        | Int      | Overall interview score (0-100)          |
| strengths    | Text     | Identified strengths (max 5,000 chars)   |
| weaknesses   | Text     | Areas for improvement (max 5,000 chars)  |
| feedback     | Text     | Detailed feedback (max 10,000 chars)     |
| createdAt    | DateTime | Timestamp of evaluation creation         |

### Relationships

- **Evaluation** ↔ **Interview**: One-to-one relationship (one evaluation per interview)
- **Evaluation** → **User**: Indirect relationship through Interview

### Constraints

- `interviewId` is unique (one evaluation per interview)
- Interview must be COMPLETED before evaluation can be created

---

## API Endpoints

Base path: `/api/v1/evaluations`

All endpoints require authentication via `requireAuthentication` middleware.

### 1. Create Evaluation

**POST** `/api/v1/evaluations/:interviewId`

Create an evaluation for a completed interview.

#### Request

**Path Parameters:**
- `interviewId` (string, required): Interview ID (CUID format)

**Body:**
```json
{
  "score": 85,
  "strengths": "Strong problem-solving skills. Clear communication. Good code structure.",
  "weaknesses": "Could improve time complexity analysis. Needs more edge case handling.",
  "feedback": "Overall excellent performance. The candidate demonstrated..."
}
```

**Validation:**
- `score`: Integer, 0-100
- `strengths`: String, 1-5,000 characters
- `weaknesses`: String, 1-5,000 characters
- `feedback`: String, 1-10,000 characters

#### Response

**Success (201 Created):**
```json
{
  "success": true,
  "message": "Evaluation created successfully",
  "data": {
    "evaluation": {
      "id": "clxx1234567890abcdefghij",
      "interviewId": "clxx0987654321jihgfedcba",
      "score": 85,
      "strengths": "Strong problem-solving skills...",
      "weaknesses": "Could improve time complexity...",
      "feedback": "Overall excellent performance...",
      "createdAt": "2026-07-29T10:30:00.000Z",
      "interview": {
        "id": "clxx0987654321jihgfedcba",
        "title": "Senior Backend Developer Interview",
        "userId": "clxx1111222233334444555566",
        "status": "COMPLETED",
        "role": "Backend Developer",
        "difficulty": "HARD"
      }
    }
  }
}
```

**Errors:**
- `400 Bad Request`: Validation errors or interview not completed
- `404 Not Found`: Interview not found or doesn't belong to user
- `409 Conflict`: Evaluation already exists for this interview

---

### 2. Get Evaluation by Interview

**GET** `/api/v1/evaluations/:interviewId`

Retrieve the evaluation for a specific interview.

#### Request

**Path Parameters:**
- `interviewId` (string, required): Interview ID (CUID format)

#### Response

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "evaluation": {
      "id": "clxx1234567890abcdefghij",
      "interviewId": "clxx0987654321jihgfedcba",
      "score": 85,
      "strengths": "Strong problem-solving skills...",
      "weaknesses": "Could improve time complexity...",
      "feedback": "Overall excellent performance...",
      "createdAt": "2026-07-29T10:30:00.000Z",
      "interview": {
        "id": "clxx0987654321jihgfedcba",
        "title": "Senior Backend Developer Interview",
        "userId": "clxx1111222233334444555566",
        "status": "COMPLETED",
        "role": "Backend Developer",
        "difficulty": "HARD"
      }
    }
  }
}
```

**Errors:**
- `404 Not Found`: Evaluation not found or doesn't belong to user

---

### 3. List All Evaluations

**GET** `/api/v1/evaluations`

Get all evaluations for the authenticated user.

#### Response

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "evaluations": [
      {
        "id": "clxx1234567890abcdefghij",
        "interviewId": "clxx0987654321jihgfedcba",
        "score": 85,
        "strengths": "Strong problem-solving skills...",
        "weaknesses": "Could improve time complexity...",
        "feedback": "Overall excellent performance...",
        "createdAt": "2026-07-29T10:30:00.000Z",
        "interview": {
          "id": "clxx0987654321jihgfedcba",
          "title": "Senior Backend Developer Interview",
          "userId": "clxx1111222233334444555566",
          "status": "COMPLETED",
          "role": "Backend Developer",
          "difficulty": "HARD",
          "completedAt": "2026-07-29T10:00:00.000Z"
        }
      }
    ],
    "total": 1
  }
}
```

---

### 4. Update Evaluation

**PATCH** `/api/v1/evaluations/:interviewId`

Update an existing evaluation.

#### Request

**Path Parameters:**
- `interviewId` (string, required): Interview ID (CUID format)

**Body (all fields optional, at least one required):**
```json
{
  "score": 90,
  "strengths": "Updated strengths...",
  "weaknesses": "Updated weaknesses...",
  "feedback": "Updated feedback..."
}
```

#### Response

**Success (200 OK):**
```json
{
  "success": true,
  "message": "Evaluation updated successfully",
  "data": {
    "evaluation": {
      "id": "clxx1234567890abcdefghij",
      "interviewId": "clxx0987654321jihgfedcba",
      "score": 90,
      "strengths": "Updated strengths...",
      "weaknesses": "Updated weaknesses...",
      "feedback": "Updated feedback...",
      "createdAt": "2026-07-29T10:30:00.000Z",
      "interview": {
        "id": "clxx0987654321jihgfedcba",
        "title": "Senior Backend Developer Interview",
        "userId": "clxx1111222233334444555566",
        "status": "COMPLETED",
        "role": "Backend Developer",
        "difficulty": "HARD"
      }
    }
  }
}
```

**Errors:**
- `400 Bad Request`: No fields provided for update
- `404 Not Found`: Evaluation not found or doesn't belong to user

---

### 5. Delete Evaluation

**DELETE** `/api/v1/evaluations/:interviewId`

Delete an evaluation.

#### Request

**Path Parameters:**
- `interviewId` (string, required): Interview ID (CUID format)

#### Response

**Success (200 OK):**
```json
{
  "success": true,
  "message": "Evaluation deleted successfully",
  "data": null
}
```

**Errors:**
- `404 Not Found`: Evaluation not found or doesn't belong to user

---

## Business Rules

### Evaluation Creation Rules

1. **Interview Completion Required**: Interview status must be `COMPLETED`
2. **One Evaluation Per Interview**: Unique constraint on `interviewId`
3. **Ownership Verification**: User must own the interview
4. **No Regeneration**: Once created, evaluation cannot be duplicated (use update instead)

### Score Rules

- Score must be an integer between 0 and 100 (inclusive)
- Represents overall interview performance

### Content Limits

- **Strengths**: 1-5,000 characters
- **Weaknesses**: 1-5,000 characters
- **Feedback**: 1-10,000 characters

---

## Security

### Authentication
- All endpoints require JWT authentication via `requireAuthentication` middleware
- User ID extracted from authenticated token (`req.user.id`)

### Authorization
- Users can only access evaluations for their own interviews
- Ownership verified through Interview relationship
- 404 errors returned for unauthorized access (prevents information leakage)

### Validation
- All inputs validated using Zod schemas
- CUID format validation for IDs
- Content length limits enforced
- Score range validation (0-100)

---

## Repository Methods

### `createEvaluation(evaluationData)`
Creates a new evaluation with interview details included.

### `findByInterviewId(interviewId)`
Finds evaluation by interview ID, includes interview details.

### `findByUserId(userId)`
Finds all evaluations for a user through interview relationship, ordered by creation date (newest first).

### `updateEvaluation(interviewId, updateData)`
Updates evaluation fields, includes interview details in response.

### `deleteEvaluation(interviewId)`
Deletes evaluation by interview ID.

### `countByUserId(userId)`
Counts total evaluations for a user (for pagination/stats).

---

## Service Methods

### `requestEvaluation(userId, interviewId, evaluationData)`
**Purpose**: Create evaluation for completed interview

**Validations**:
- Interview exists and belongs to user
- Interview status is COMPLETED
- No existing evaluation for this interview

**Returns**: Created evaluation with interview details

---

### `getEvaluation(userId, interviewId)`
**Purpose**: Retrieve evaluation for an interview

**Validations**:
- Evaluation exists
- User owns the interview

**Returns**: Evaluation with interview details

---

### `listEvaluations(userId)`
**Purpose**: Get all evaluations for authenticated user

**Returns**: Object with evaluations array and total count

---

### `updateEvaluation(userId, interviewId, updateData)`
**Purpose**: Update existing evaluation

**Validations**:
- Evaluation exists
- User owns the interview

**Returns**: Updated evaluation with interview details

---

### `deleteEvaluation(userId, interviewId)`
**Purpose**: Delete evaluation

**Validations**:
- Evaluation exists
- User owns the interview

**Returns**: void

---

## Error Handling

### Common Errors

| Status | Error                                      | Cause                                    |
|--------|-----------------------------------------------|------------------------------------------|
| 400    | Interview must be completed before evaluation | Interview status is not COMPLETED        |
| 400    | Validation error                              | Invalid input data                       |
| 404    | Interview not found                           | Interview doesn't exist or wrong user    |
| 404    | Evaluation not found                          | Evaluation doesn't exist or wrong user   |
| 409    | Evaluation already exists for this interview  | Duplicate evaluation attempt             |

---

## Integration Points

### With Interview Module
- Verifies interview completion status
- Ensures interview ownership
- Cascade delete: Deleting interview deletes evaluation

### With Report Module (Future)
- Evaluation data used to generate comprehensive reports
- Score feeds into overall report metrics

---

## Testing Checklist

### Functional Tests
- ✓ Create evaluation for completed interview
- ✓ Prevent duplicate evaluations
- ✓ Block evaluation for non-completed interviews
- ✓ Retrieve evaluation by interview ID
- ✓ List all user evaluations
- ✓ Update evaluation fields
- ✓ Delete evaluation
- ✓ Ownership verification

### Security Tests
- ✓ Unauthenticated access blocked
- ✓ Cross-user access blocked
- ✓ Invalid interview ID rejected

### Validation Tests
- ✓ Score range validation (0-100)
- ✓ Content length limits enforced
- ✓ Required fields validation
- ✓ CUID format validation

---

## Future Enhancements

1. **AI Integration**: Connect to AI service for automatic evaluation generation
2. **Evaluation Status**: Add status field (PENDING, PROCESSING, COMPLETED, FAILED)
3. **Category Scores**: Break down score into technical, communication, problem-solving
4. **Regeneration**: Allow evaluation regeneration with user confirmation
5. **Evaluation History**: Track evaluation versions/changes
6. **Batch Operations**: Evaluate multiple interviews at once

---

## Module Statistics

- **Repository Methods**: 6
- **Service Methods**: 5
- **Controllers**: 5
- **Endpoints**: 5
- **Validation Schemas**: 3

---

## Implementation Status

✅ Evaluation Repository  
✅ Evaluation Service  
✅ Evaluation Controller  
✅ Evaluation Routes  
✅ Evaluation Validation  
✅ Route Registration  
✅ Documentation  

**Module Status**: COMPLETE

---

## Related Documentation

- `AUTHENTICATION.MD`: Authentication and authorization patterns
- `INTERVIEW_MODULE.MD`: Interview status and lifecycle
- `DATABASE_DESIGN.MD`: Complete database schema
- `ARCHITECTURE.MD`: System architecture overview
