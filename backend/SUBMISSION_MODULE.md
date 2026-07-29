# Submission Module Documentation

## Overview

The Submission Module provides complete functionality for managing candidate responses during interviews. It supports text answers, code submissions, auto-save functionality, and enforces business rules to ensure data integrity.

---

## Architecture

### Layered Structure

```
Routes → Controller → Service → Repository → Prisma → PostgreSQL
```

**Submission Routes** (`src/routes/submission.routes.js`)
- Defines HTTP endpoints
- Applies authentication middleware
- Applies validation middleware

**Submission Controller** (`src/controllers/submission.controller.js`)
- Handles HTTP requests/responses
- Extracts user context from `req.user`
- Delegates to service layer

**Submission Service** (`src/services/submission.service.js`)
- Contains business logic
- Validates ownership through interview
- Enforces IN_PROGRESS interview requirement
- Prevents modifications after completion

**Submission Repository** (`src/repositories/submission.repository.js`)
- Database access only (Prisma calls)
- CRUD operations
- Upsert functionality for auto-save

---

## Database Schema

### Submission Model

```prisma
model Submission {
  id          String   @id @default(cuid())
  interviewId String
  questionId  String
  answer      String?  @db.Text
  code        String?  @db.Text
  language    String?
  createdAt   DateTime @default(now())

  // Relations
  interview Interview @relation(fields: [interviewId], references: [id], onDelete: Cascade)
  question  Question  @relation(fields: [questionId], references: [id], onDelete: Cascade)

  @@unique([interviewId, questionId])
  @@index([interviewId])
  @@index([questionId])
  @@index([interviewId, questionId])
  @@map("submissions")
}
```

### Key Constraints

- **Unique Constraint**: `[interviewId, questionId]` - One submission per question per interview
- **Cascade Delete**: Submissions are deleted when interview or question is deleted
- **Indexes**: Optimized for querying submissions by interview and question

---

## API Endpoints

### Base Path
```
/api/v1/submissions
```

All endpoints require authentication.

---

### 1. Save Submission (Auto-Save)

**Endpoint**: `POST /api/v1/submissions`

**Description**: Create a new submission or update existing one (upsert operation for auto-save).

**Authentication**: Required

**Request Body**:
```json
{
  "interviewId": "clx1234567890",
  "questionId": "clx9876543210",
  "answer": "Event delegation is a technique...",
  "code": "function debounce(func, delay) { ... }",
  "language": "javascript"
}
```

**Validation Rules**:
- `interviewId`: Required, valid CUID
- `questionId`: Required, valid CUID
- `answer`: Optional, max 10,000 characters
- `code`: Optional, max 50,000 characters
- `language`: Optional, max 50 characters
- At least one of `answer` or `code` must be provided

**Success Response (201)**:
```json
{
  "success": true,
  "data": {
    "submission": {
      "id": "clx1111111111",
      "interviewId": "clx1234567890",
      "questionId": "clx9876543210",
      "answer": "Event delegation is a technique...",
      "code": "function debounce(func, delay) { ... }",
      "language": "javascript",
      "createdAt": "2026-07-29T10:30:00Z",
      "interview": {
        "id": "clx1234567890",
        "title": "Senior JavaScript Developer Interview",
        "userId": "clx1234567890",
        "status": "IN_PROGRESS"
      },
      "question": {
        "id": "clx9876543210",
        "question": "Implement a debounce function",
        "type": "CODING",
        "difficulty": "MEDIUM",
        "order": 3
      }
    }
  },
  "message": "Submission saved successfully"
}
```

**Behavior**:
- If submission doesn't exist: Creates new submission
- If submission exists: Updates existing submission (auto-save)
- Unique constraint ensures one submission per question

**Error Responses**:

*404 - Interview Not Found*:
```json
{
  "success": false,
  "message": "Interview not found"
}
```

*400 - Interview Not In Progress*:
```json
{
  "success": false,
  "message": "Interview must be in progress to submit answers"
}
```

*404 - Question Not In Interview*:
```json
{
  "success": false,
  "message": "Question not found in this interview"
}
```

---

### 2. Update Submission

**Endpoint**: `PATCH /api/v1/submissions/:id`

**Description**: Update an existing submission.

**Authentication**: Required

**Parameters**:
- `id` (path): Submission ID (CUID format)

**Request Body** (all fields optional, at least one required):
```json
{
  "answer": "Updated answer with more details...",
  "code": "// Updated code implementation",
  "language": "typescript"
}
```

**Validation Rules**:
- At least one field must be provided
- `answer`: Max 10,000 characters
- `code`: Max 50,000 characters
- `language`: Max 50 characters, can only be provided with code

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "submission": {
      "id": "clx1111111111",
      "interviewId": "clx1234567890",
      "questionId": "clx9876543210",
      "answer": "Updated answer with more details...",
      "code": "// Updated code implementation",
      "language": "typescript",
      "createdAt": "2026-07-29T10:30:00Z",
      "interview": { ... },
      "question": { ... }
    }
  },
  "message": "Submission updated successfully"
}
```

**Error Responses**:

*404 - Not Found*:
```json
{
  "success": false,
  "message": "Submission not found"
}
```

*400 - Interview Completed*:
```json
{
  "success": false,
  "message": "Cannot update submission after interview completion"
}
```

---

### 3. List Submissions for Interview

**Endpoint**: `GET /api/v1/submissions/interview/:interviewId`

**Description**: Get all submissions for a specific interview, ordered by question order.

**Authentication**: Required

**Parameters**:
- `interviewId` (path): Interview ID (CUID format)

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": "clx1111111111",
        "interviewId": "clx1234567890",
        "questionId": "clx9876543210",
        "answer": "Event delegation is...",
        "code": null,
        "language": null,
        "createdAt": "2026-07-29T10:30:00Z",
        "question": {
          "id": "clx9876543210",
          "question": "Explain event delegation",
          "type": "TECHNICAL",
          "difficulty": "MEDIUM",
          "order": 1
        }
      },
      {
        "id": "clx2222222222",
        "interviewId": "clx1234567890",
        "questionId": "clx8888888888",
        "answer": null,
        "code": "function debounce() { ... }",
        "language": "javascript",
        "createdAt": "2026-07-29T10:35:00Z",
        "question": {
          "id": "clx8888888888",
          "question": "Implement debounce function",
          "type": "CODING",
          "difficulty": "HARD",
          "order": 2
        }
      }
    ],
    "total": 2
  }
}
```

**Features**:
- Submissions sorted by question order (ascending)
- Includes question details
- Returns total count

---

### 4. Get Single Submission

**Endpoint**: `GET /api/v1/submissions/:id`

**Description**: Get details of a specific submission.

**Authentication**: Required

**Parameters**:
- `id` (path): Submission ID (CUID format)

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "submission": {
      "id": "clx1111111111",
      "interviewId": "clx1234567890",
      "questionId": "clx9876543210",
      "answer": "Event delegation is...",
      "code": null,
      "language": null,
      "createdAt": "2026-07-29T10:30:00Z",
      "interview": {
        "id": "clx1234567890",
        "title": "Senior JavaScript Developer Interview",
        "userId": "clx1234567890",
        "status": "IN_PROGRESS"
      },
      "question": {
        "id": "clx9876543210",
        "question": "Explain event delegation",
        "type": "TECHNICAL",
        "difficulty": "MEDIUM",
        "order": 1
      }
    }
  }
}
```

---

### 5. Delete Submission

**Endpoint**: `DELETE /api/v1/submissions/:id`

**Description**: Delete a submission.

**Authentication**: Required

**Parameters**:
- `id` (path): Submission ID (CUID format)

**Success Response (200)**:
```json
{
  "success": true,
  "data": null,
  "message": "Submission deleted successfully"
}
```

**Error Responses**:

*404 - Not Found*:
```json
{
  "success": false,
  "message": "Submission not found"
}
```

*400 - Interview Completed*:
```json
{
  "success": false,
  "message": "Cannot delete submission after interview completion"
}
```

---

## Business Rules

### One Submission Per Question

- Each question can have only one submission per interview
- Unique constraint: `[interviewId, questionId]`
- Auto-save updates existing submission instead of creating duplicate

### Interview Status Requirements

**Can Submit/Update**:
- ✅ Interview status: `IN_PROGRESS`

**Cannot Submit/Update**:
- ❌ Interview status: `DRAFT`, `COMPLETED`, `CANCELLED`

**Error Messages**:
- "Interview must be in progress to submit answers"
- "Cannot update submission after interview completion"
- "Cannot delete submission after interview completion"

### Ownership Verification

All submission operations verify ownership through the interview:

1. Fetch submission with interview details
2. Check if `interview.userId` matches authenticated user ID
3. Return 404 if ownership fails (security - don't reveal existence)

### Question Validation

- Question must exist
- Question must belong to the specified interview
- Validates `question.interview.id === interviewId`

### Auto-Save Functionality

The `POST /api/v1/submissions` endpoint uses upsert:
- First submission: Creates new record
- Subsequent saves: Updates existing record
- No duplicate submissions possible
- Seamless auto-save experience

---

## Security Features

### Authentication
- All endpoints require valid Clerk authentication token
- `req.user` populated by auth middleware
- Unauthenticated requests return 401

### Ownership Verification
- Submissions accessed only through interview ownership
- User ID from token (never from request body)
- 404 response for unauthorized access (don't leak existence)

### Input Validation
- Zod schemas validate all inputs
- Length constraints (answer: 10K, code: 50K chars)
- Format validation (CUID IDs)
- Required field validation

### SQL Injection Prevention
- Prisma parameterizes all queries
- No raw SQL queries
- Type-safe database access

---

## Usage Examples

### Example 1: Auto-Save Text Answer

```javascript
// First save - creates submission
const response1 = await fetch('http://localhost:5000/api/v1/submissions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${clerkToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    interviewId: 'clx1234567890',
    questionId: 'clx9876543210',
    answer: 'Event delegation is a JavaScript technique...'
  })
});

// Second save (auto-save) - updates same submission
const response2 = await fetch('http://localhost:5000/api/v1/submissions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${clerkToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    interviewId: 'clx1234567890',
    questionId: 'clx9876543210',
    answer: 'Event delegation is a JavaScript technique that allows... (more details)'
  })
});
```

### Example 2: Save Code Submission

```javascript
const response = await fetch('http://localhost:5000/api/v1/submissions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${clerkToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    interviewId: 'clx1234567890',
    questionId: 'clx8888888888',
    code: `function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}`,
    language: 'javascript'
  })
});
```

### Example 3: Save Combined Answer and Code

```javascript
const response = await fetch('http://localhost:5000/api/v1/submissions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${clerkToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    interviewId: 'clx1234567890',
    questionId: 'clx7777777777',
    answer: 'My approach is to use a hash map for O(1) lookup...',
    code: 'function twoSum(nums, target) { ... }',
    language: 'javascript'
  })
});
```

### Example 4: Fetch All Submissions

```javascript
const response = await fetch(
  `http://localhost:5000/api/v1/submissions/interview/${interviewId}`,
  {
    headers: {
      'Authorization': `Bearer ${clerkToken}`
    }
  }
);

const { data } = await response.json();
console.log(`Total submissions: ${data.total}`);
data.submissions.forEach(sub => {
  console.log(`Q${sub.question.order}: ${sub.question.question}`);
  console.log(`Answer: ${sub.answer || 'No text answer'}`);
  console.log(`Code: ${sub.code ? 'Provided' : 'Not provided'}\n`);
});
```

---

## Testing Checklist

### Save Submission (Auto-Save)
- [ ] Create new submission with answer only
- [ ] Create new submission with code only
- [ ] Create new submission with both answer and code
- [ ] Update existing submission (auto-save)
- [ ] Reject if interview not found
- [ ] Reject if interview not owned by user
- [ ] Reject if interview not IN_PROGRESS
- [ ] Reject if question not in interview
- [ ] Reject if neither answer nor code provided
- [ ] Enforce unique constraint (one per question)

### Update Submission
- [ ] Update answer field
- [ ] Update code field
- [ ] Update language field
- [ ] Update multiple fields at once
- [ ] Reject if submission not found
- [ ] Reject if not owned by user
- [ ] Reject if interview completed
- [ ] Reject if no fields provided

### List Submissions
- [ ] List all submissions for interview
- [ ] Return submissions in question order
- [ ] Include question details
- [ ] Return total count
- [ ] Return empty array if no submissions
- [ ] Reject if interview not owned by user

### Get Submission
- [ ] Get submission details
- [ ] Include interview and question info
- [ ] Reject if not found
- [ ] Reject if not owned by user

### Delete Submission
- [ ] Delete successfully
- [ ] Reject if interview completed
- [ ] Reject if not found
- [ ] Reject if not owned by user

---

## Integration Points

### Interview Module
- Verifies interview ownership before all operations
- Checks interview status (must be IN_PROGRESS)
- Uses `interviewRepository.findByIdAndUserId()`

### Question Module
- Validates question exists and belongs to interview
- Uses `questionRepository.findById()`
- Includes question details in responses

### Evaluation Module (Future)
- Submissions will be input for AI evaluation
- Gemini will analyze answers and code
- Evaluations linked to submissions

---

## Performance Considerations

### Database Indexes

```prisma
@@index([interviewId])           // Fast lookup by interview
@@index([questionId])            // Fast lookup by question
@@index([interviewId, questionId]) // Fast compound lookup
@@unique([interviewId, questionId]) // Enforce uniqueness
```

### Query Optimization
- Submissions always fetched with interview/question context
- Sorted by question order in database (not application)
- Upsert uses efficient Prisma operation

### Caching Opportunities (Future)
- Cache submissions per interview
- Invalidate on save/update/delete
- Consider real-time updates via WebSocket

---

## Files

### Created Files

- `src/repositories/submission.repository.js` - Database access layer
- `src/services/submission.service.js` - Business logic layer
- `src/controllers/submission.controller.js` - HTTP handler layer
- `src/routes/submission.routes.js` - Route definitions
- `src/validations/submission.validation.js` - Zod schemas

### Modified Files

- `src/routes/api.routes.js` - Registered submission routes

---

## Next Steps

### Evaluation Module
After Submission Module, implement:
1. AI evaluation endpoint (Gemini integration)
2. Score calculation based on submissions
3. Feedback generation
4. Link evaluations to submissions

### Report Module
Then implement:
1. Performance report generation
2. Aggregate statistics
3. Strengths and weaknesses analysis
4. Interview summary

---

## Conclusion

The Submission Module is **complete and production-ready**. It provides:

✅ Auto-save functionality (upsert operation)  
✅ Text and code answer support  
✅ Ownership verification through interviews  
✅ IN_PROGRESS interview requirement  
✅ One submission per question constraint  
✅ Comprehensive validation  
✅ Layered architecture compliance  

**Status**: ✅ **COMPLETE**  
**Ready For**: Evaluation Module Implementation
