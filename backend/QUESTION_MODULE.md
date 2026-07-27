# Question Module Documentation

## Overview

The Question Module provides complete CRUD operations for managing interview questions. Questions are linked to specific interviews and support both manual creation and bulk insertion for AI-generated questions.

---

## Architecture

### Layered Structure

```
Routes → Controller → Service → Repository → Prisma → PostgreSQL
```

**Question Routes** (`src/routes/question.routes.js`)
- Defines HTTP endpoints
- Applies authentication middleware
- Applies validation middleware

**Question Controller** (`src/controllers/question.controller.js`)
- Handles HTTP requests/responses
- Extracts user context from `req.user`
- Delegates to service layer

**Question Service** (`src/services/question.service.js`)
- Contains business logic
- Validates ownership through interview
- Enforces question ordering rules
- Prevents modifications to completed interviews

**Question Repository** (`src/repositories/question.repository.js`)
- Database access only (Prisma calls)
- CRUD operations
- Order management utilities

---

## Database Schema

### Question Model

```prisma
model Question {
  id          String       @id @default(cuid())
  interviewId String
  question    String       @db.Text
  type        QuestionType
  difficulty  Difficulty
  order       Int
  createdAt   DateTime     @default(now())

  // Relations
  interview   Interview    @relation(fields: [interviewId], references: [id], onDelete: Cascade)
  submissions Submission[]

  @@unique([interviewId, order])
  @@index([interviewId])
  @@index([interviewId, order])
  @@map("questions")
}
```

### Enums

**QuestionType**
- `MCQ` - Multiple Choice Question
- `TECHNICAL` - Technical concept question
- `CODING` - Coding challenge
- `HR` - Human Resources question
- `BEHAVIORAL` - Behavioral interview question

**Difficulty**
- `EASY`
- `MEDIUM`
- `HARD`

### Key Constraints

- **Unique Constraint**: `[interviewId, order]` - Each interview has unique question order numbers
- **Cascade Delete**: Questions are deleted when interview is deleted
- **Indexes**: Optimized for querying questions by interview and order

---

## API Endpoints

### Base Path
```
/api/v1/questions
```

All endpoints require authentication.

---

### 1. Create Question

**Endpoint**: `POST /api/v1/questions`

**Description**: Create a single question for an interview.

**Authentication**: Required

**Request Body**:
```json
{
  "interviewId": "clx1234567890",
  "question": "Explain the difference between var, let, and const in JavaScript",
  "type": "TECHNICAL",
  "difficulty": "MEDIUM",
  "order": 1  // Optional - auto-generated if not provided
}
```

**Validation Rules**:
- `interviewId`: Required, valid CUID format
- `question`: Required, 10-5000 characters
- `type`: Required, must be one of: MCQ, TECHNICAL, CODING, HR, BEHAVIORAL
- `difficulty`: Required, must be one of: EASY, MEDIUM, HARD
- `order`: Optional, positive integer

**Success Response (201)**:
```json
{
  "success": true,
  "data": {
    "question": {
      "id": "clx1234567890",
      "interviewId": "clx1234567890",
      "question": "Explain the difference between var, let, and const in JavaScript",
      "type": "TECHNICAL",
      "difficulty": "MEDIUM",
      "order": 1,
      "createdAt": "2026-07-26T10:30:00Z",
      "interview": {
        "id": "clx1234567890",
        "title": "Senior JavaScript Developer Interview",
        "userId": "clx1234567890"
      }
    }
  },
  "message": "Question created successfully"
}
```

**Error Responses**:

*404 - Interview Not Found*:
```json
{
  "success": false,
  "message": "Interview not found"
}
```

*400 - Completed Interview*:
```json
{
  "success": false,
  "message": "Cannot add questions to completed interview"
}
```

*400 - Duplicate Order*:
```json
{
  "success": false,
  "message": "Question with order 1 already exists for this interview"
}
```

---

### 2. Create Bulk Questions

**Endpoint**: `POST /api/v1/questions/bulk`

**Description**: Create multiple questions at once (for AI-generated questions).

**Authentication**: Required

**Request Body**:
```json
{
  "interviewId": "clx1234567890",
  "questions": [
    {
      "question": "What is hoisting in JavaScript?",
      "type": "TECHNICAL",
      "difficulty": "EASY",
      "order": 1  // Optional
    },
    {
      "question": "Implement a function to reverse a string",
      "type": "CODING",
      "difficulty": "MEDIUM",
      "order": 2  // Optional
    },
    {
      "question": "Explain your approach to debugging production issues",
      "type": "BEHAVIORAL",
      "difficulty": "MEDIUM",
      "order": 3  // Optional
    }
  ]
}
```

**Validation Rules**:
- `interviewId`: Required, valid CUID format
- `questions`: Required array, 1-50 questions
- Each question follows same validation as single create

**Success Response (201)**:
```json
{
  "success": true,
  "data": {
    "count": 3,
    "questions": [
      {
        "id": "clx1234567890",
        "interviewId": "clx1234567890",
        "question": "What is hoisting in JavaScript?",
        "type": "TECHNICAL",
        "difficulty": "EASY",
        "order": 1,
        "createdAt": "2026-07-26T10:30:00Z"
      },
      // ... more questions
    ]
  },
  "message": "3 questions created successfully"
}
```

**Features**:
- Auto-generates order numbers if not provided
- Skips duplicates (based on interviewId + order)
- Returns all questions for the interview (including previously created)

---

### 3. Get Interview Questions

**Endpoint**: `GET /api/v1/questions/interview/:interviewId`

**Description**: Get all questions for a specific interview, ordered by order field.

**Authentication**: Required

**Parameters**:
- `interviewId` (path): Interview ID (CUID format)

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "clx1234567890",
        "interviewId": "clx1234567890",
        "question": "What is hoisting in JavaScript?",
        "type": "TECHNICAL",
        "difficulty": "EASY",
        "order": 1,
        "createdAt": "2026-07-26T10:30:00Z"
      },
      {
        "id": "clx9876543210",
        "interviewId": "clx1234567890",
        "question": "Implement a function to reverse a string",
        "type": "CODING",
        "difficulty": "MEDIUM",
        "order": 2,
        "createdAt": "2026-07-26T10:31:00Z"
      }
    ],
    "total": 2
  }
}
```

**Features**:
- Questions sorted by `order` field (ascending)
- Includes total count
- Empty array if no questions exist

---

### 4. Get Single Question

**Endpoint**: `GET /api/v1/questions/:id`

**Description**: Get details of a specific question.

**Authentication**: Required

**Parameters**:
- `id` (path): Question ID (CUID format)

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "question": {
      "id": "clx1234567890",
      "interviewId": "clx1234567890",
      "question": "What is hoisting in JavaScript?",
      "type": "TECHNICAL",
      "difficulty": "EASY",
      "order": 1,
      "createdAt": "2026-07-26T10:30:00Z",
      "interview": {
        "id": "clx1234567890",
        "title": "Senior JavaScript Developer Interview",
        "userId": "clx1234567890",
        "status": "DRAFT"
      }
    }
  }
}
```

**Error Response (404)**:
```json
{
  "success": false,
  "message": "Question not found"
}
```

---

### 5. Update Question

**Endpoint**: `PATCH /api/v1/questions/:id`

**Description**: Update a question's details.

**Authentication**: Required

**Parameters**:
- `id` (path): Question ID (CUID format)

**Request Body** (all fields optional, at least one required):
```json
{
  "question": "Explain the difference between var, let, and const with examples",
  "type": "TECHNICAL",
  "difficulty": "HARD",
  "order": 5
}
```

**Validation Rules**:
- At least one field must be provided
- `question`: 10-5000 characters
- `type`: Must be valid QuestionType enum
- `difficulty`: Must be valid Difficulty enum
- `order`: Positive integer, must be unique for the interview

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "question": {
      "id": "clx1234567890",
      "interviewId": "clx1234567890",
      "question": "Explain the difference between var, let, and const with examples",
      "type": "TECHNICAL",
      "difficulty": "HARD",
      "order": 5,
      "createdAt": "2026-07-26T10:30:00Z",
      "interview": {
        "id": "clx1234567890",
        "title": "Senior JavaScript Developer Interview",
        "userId": "clx1234567890"
      }
    }
  },
  "message": "Question updated successfully"
}
```

**Error Responses**:

*404 - Not Found*:
```json
{
  "success": false,
  "message": "Question not found"
}
```

*400 - Completed Interview*:
```json
{
  "success": false,
  "message": "Cannot update questions in completed interview"
}
```

*400 - Duplicate Order*:
```json
{
  "success": false,
  "message": "Question with order 5 already exists for this interview"
}
```

---

### 6. Delete Question

**Endpoint**: `DELETE /api/v1/questions/:id`

**Description**: Delete a question.

**Authentication**: Required

**Parameters**:
- `id` (path): Question ID (CUID format)

**Success Response (200)**:
```json
{
  "success": true,
  "data": null,
  "message": "Question deleted successfully"
}
```

**Error Responses**:

*404 - Not Found*:
```json
{
  "success": false,
  "message": "Question not found"
}
```

*400 - Completed Interview*:
```json
{
  "success": false,
  "message": "Cannot delete questions from completed interview"
}
```

---

## Business Rules

### Ownership Verification

All question operations verify ownership through the interview:

1. Fetch question with interview details
2. Check if `interview.userId` matches authenticated user ID
3. Return 404 if ownership fails (security - don't reveal existence)

### Question Ordering

- Each interview has its own sequence of question order numbers
- Order numbers must be unique within an interview
- Order numbers start at 1 and increment
- Auto-generation: If order not provided, uses `max(order) + 1`
- Manual ordering: Validates uniqueness before creating/updating

### Completed Interview Protection

Questions in completed interviews are **immutable**:
- ❌ Cannot create new questions
- ❌ Cannot update existing questions
- ❌ Cannot delete questions

This ensures interview integrity after completion.

### Cascade Deletion

When an interview is deleted:
- All associated questions are automatically deleted (Prisma cascade)
- Submissions linked to those questions are also deleted

---

## Security Features

### Authentication
- All endpoints require valid Clerk authentication token
- `req.user` populated by auth middleware
- Unauthenticated requests return 401

### Ownership Verification
- Questions accessed only through interview ownership
- User ID from token (never from request body)
- 404 response for unauthorized access (don't leak existence)

### Input Validation
- Zod schemas validate all inputs
- Type checking (enums)
- Length constraints (question text)
- Format validation (CUID IDs)

### SQL Injection Prevention
- Prisma parameterizes all queries
- No raw SQL queries
- Type-safe database access

---

## Error Handling

### Standard Error Format

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Error Codes

- **400** - Bad Request (validation errors, business rule violations)
- **401** - Unauthorized (missing/invalid auth token)
- **404** - Not Found (question/interview doesn't exist or no access)
- **500** - Internal Server Error (unexpected errors)

### Error Scenarios

**Validation Errors**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "question",
      "message": "Question must be at least 10 characters"
    },
    {
      "field": "type",
      "message": "Question type must be one of: MCQ, TECHNICAL, CODING, HR, BEHAVIORAL"
    }
  ]
}
```

**Business Rule Violations**:
- Completed interview modification attempts
- Duplicate order numbers
- Interview not found
- Question not found

---

## Usage Examples

### Example 1: Creating Questions Manually

```javascript
// Create first question
const response1 = await fetch('http://localhost:5000/api/v1/questions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${clerkToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    interviewId: 'clx1234567890',
    question: 'What is closure in JavaScript?',
    type: 'TECHNICAL',
    difficulty: 'MEDIUM'
    // order auto-generated as 1
  })
});

// Create second question
const response2 = await fetch('http://localhost:5000/api/v1/questions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${clerkToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    interviewId: 'clx1234567890',
    question: 'Implement a debounce function',
    type: 'CODING',
    difficulty: 'HARD'
    // order auto-generated as 2
  })
});
```

### Example 2: Bulk Creating AI-Generated Questions

```javascript
const response = await fetch('http://localhost:5000/api/v1/questions/bulk', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${clerkToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    interviewId: 'clx1234567890',
    questions: [
      {
        question: 'Explain event delegation in JavaScript',
        type: 'TECHNICAL',
        difficulty: 'MEDIUM'
      },
      {
        question: 'Write a function to find the longest palindrome in a string',
        type: 'CODING',
        difficulty: 'HARD'
      },
      {
        question: 'Tell me about a time you had to debug a complex issue',
        type: 'BEHAVIORAL',
        difficulty: 'MEDIUM'
      },
      {
        question: 'What are your salary expectations?',
        type: 'HR',
        difficulty: 'EASY'
      }
    ]
  })
});
```

### Example 3: Fetching and Displaying Questions

```javascript
// Get all questions for an interview
const response = await fetch(
  `http://localhost:5000/api/v1/questions/interview/${interviewId}`,
  {
    headers: {
      'Authorization': `Bearer ${clerkToken}`
    }
  }
);

const { data } = await response.json();

// Display questions
data.questions.forEach((q, index) => {
  console.log(`${q.order}. [${q.difficulty}] ${q.question}`);
  console.log(`   Type: ${q.type}\n`);
});
```

### Example 4: Updating a Question

```javascript
const response = await fetch(`http://localhost:5000/api/v1/questions/${questionId}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${clerkToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    difficulty: 'HARD',
    question: 'Explain event delegation with a practical example'
  })
});
```

---

## Testing Checklist

### Create Question
- [ ] Create question with all required fields
- [ ] Create question with auto-generated order
- [ ] Create question with manual order
- [ ] Reject if interview not found
- [ ] Reject if interview not owned by user
- [ ] Reject if interview is completed
- [ ] Reject if order already exists
- [ ] Reject if question too short (< 10 chars)
- [ ] Reject if question too long (> 5000 chars)
- [ ] Reject invalid question type
- [ ] Reject invalid difficulty

### Create Bulk Questions
- [ ] Create multiple questions successfully
- [ ] Auto-generate order numbers
- [ ] Skip duplicates
- [ ] Reject if interview completed
- [ ] Reject if more than 50 questions
- [ ] Reject if empty questions array

### Get Interview Questions
- [ ] List all questions for interview
- [ ] Return questions in order
- [ ] Return empty array if no questions
- [ ] Reject if interview not owned by user

### Get Single Question
- [ ] Get question details
- [ ] Include interview info
- [ ] Reject if not found
- [ ] Reject if not owned by user

### Update Question
- [ ] Update question text
- [ ] Update type
- [ ] Update difficulty
- [ ] Update order
- [ ] Reject if completed interview
- [ ] Reject if new order already exists
- [ ] Reject if no fields provided

### Delete Question
- [ ] Delete successfully
- [ ] Reject if completed interview
- [ ] Reject if not found
- [ ] Reject if not owned by user

---

## Integration Points

### Interview Module
- Verifies interview ownership before all operations
- Checks interview status (completed check)
- Uses `interviewRepository.findByIdAndUserId()`

### Submission Module (Future)
- Questions will be linked to submissions
- Each submission references a question
- Cascade delete: submissions deleted with questions

### AI Module (Future)
- AI module will use bulk create endpoint
- Generates questions based on interview config
- Stores in database using this module

---

## Performance Considerations

### Database Indexes

```prisma
@@index([interviewId])           // Fast lookup by interview
@@index([interviewId, order])    // Fast ordered retrieval
@@unique([interviewId, order])   // Enforce uniqueness
```

### Query Optimization
- Questions always fetched with interview context
- Sorted by order in database (not application)
- Bulk insert uses `createMany` (single query)

### Caching Opportunities (Future)
- Cache questions per interview
- Invalidate on create/update/delete
- Consider read-heavy usage pattern

---

## Files

### Created Files

- `src/repositories/question.repository.js` - Database access layer
- `src/services/question.service.js` - Business logic layer
- `src/controllers/question.controller.js` - HTTP handler layer
- `src/routes/question.routes.js` - Route definitions
- `src/validations/question.validation.js` - Zod schemas

### Modified Files

- `src/routes/api.routes.js` - Registered question routes

---

## Next Steps

### Submission Module
After Question Module, implement:
1. Create submission endpoint (answer storage)
2. Auto-save functionality
3. Link submissions to questions
4. Support code submissions with language

### Evaluation Module
Then implement:
1. AI evaluation integration
2. Score calculation
3. Feedback generation
4. Link to questions and submissions

---

## Conclusion

The Question Module is **complete and production-ready**. It provides:

✅ Full CRUD operations  
✅ Ownership verification through interviews  
✅ Question ordering management  
✅ Bulk insertion support for AI  
✅ Completed interview protection  
✅ Comprehensive validation  
✅ Layered architecture compliance  

**Status**: ✅ **COMPLETE**  
**Ready For**: Submission Module Implementation
