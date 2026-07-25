# Backend Architecture

## Overview

IntervueX backend follows a **layered architecture** pattern to ensure clean separation of concerns and maintainability.

## Architecture Flow

```
Client Request
    ↓
Express Route
    ↓
Middleware (Auth, Validation)
    ↓
Controller
    ↓
Service (Business Logic)
    ↓
Repository (Database Access)
    ↓
Prisma ORM
    ↓
PostgreSQL
    ↓
Response
```

## Layer Responsibilities

### 1. Routes (`src/routes/`)

**Purpose**: Define API endpoints and attach middleware

**Responsibilities**:
- Map URLs to controllers
- Attach authentication middleware
- Attach validation middleware
- Define HTTP methods

**Do NOT**:
- Write business logic
- Access database
- Handle errors directly

**Example**:
```javascript
import express from 'express';
import { getUser, updateUser } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id', authenticate, getUser);
router.put('/:id', authenticate, updateUser);

export default router;
```

### 2. Controllers (`src/controllers/`)

**Purpose**: Handle HTTP requests and responses

**Responsibilities**:
- Receive request
- Extract data from req.body, req.params, req.query
- Call service functions
- Send response

**Do NOT**:
- Write business logic
- Query database directly
- Call Prisma

**Example**:
```javascript
import { asyncHandler } from '../utils/asyncHandler.js';
import { userService } from '../services/user.service.js';

export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  
  res.json({
    success: true,
    data: user,
  });
});
```

### 3. Services (`src/services/`)

**Purpose**: Implement business logic

**Responsibilities**:
- Business rules and validation
- Ownership checks
- Data transformation
- Orchestrate multiple repository calls
- State management

**Do NOT**:
- Handle HTTP requests/responses
- Call Prisma directly
- Return Express response objects

**Example**:
```javascript
import { userRepository } from '../repositories/user.repository.js';
import AppError from '../utils/AppError.js';

export const userService = {
  async getUserById(userId) {
    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    // Business logic: Don't expose sensitive data
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  },
};
```

### 4. Repositories (`src/repositories/`)

**Purpose**: Database access layer

**Responsibilities**:
- All Prisma queries
- CRUD operations
- Database transactions
- Query optimization

**Do NOT**:
- Implement business logic
- Return HTTP responses
- Validate business rules

**Example**:
```javascript
import prisma from '../config/prisma.js';

export const userRepository = {
  async findById(userId) {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  },
  
  async create(data) {
    return await prisma.user.create({
      data,
    });
  },
};
```

### 5. Middleware (`src/middleware/`)

**Purpose**: Request preprocessing

**Types**:
- Authentication
- Validation
- Error handling
- Logging

**Example**:
```javascript
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }
  
  // Verify token logic
  next();
};
```

### 6. Validations (`src/validations/`)

**Purpose**: Input validation with Zod

**Example**:
```javascript
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message"
}
```

## API Structure

All API routes are versioned under `/api/v1`:

```
/api/v1/auth        - Authentication endpoints
/api/v1/users       - User management
/api/v1/resumes     - Resume management
/api/v1/interviews  - Interview management
/api/v1/questions   - Question management
/api/v1/submissions - Submission handling
/api/v1/evaluations - Evaluation results
/api/v1/reports     - Report generation
/api/v1/dashboard   - Dashboard data
/api/v1/ai          - AI operations
```

## Naming Conventions

### Files

- Controllers: `user.controller.js`
- Services: `user.service.js`
- Repositories: `user.repository.js`
- Routes: `user.routes.js`
- Validations: `user.validation.js`

### Functions

- Use camelCase: `getUserById`, `createUser`
- Be descriptive: `getUserWithInterviews`, not `getData`

### Variables

- Use camelCase: `userId`, `interviewData`
- Constants: Use UPPER_SNAKE_CASE: `MAX_RETRIES`

## Error Handling

Use the custom `AppError` class for operational errors:

```javascript
throw new AppError('Resource not found', 404);
```

Errors are caught by the global error handler and returned in consistent format.

## Development Rules

1. **One Responsibility Per File**: Each file should do one thing well
2. **No Direct Database Access in Controllers**: Always go through services
3. **No Business Logic in Repositories**: Keep them focused on data access
4. **Use Async/Await**: No callbacks or .then() chains
5. **Handle Errors Properly**: Use try-catch or asyncHandler
6. **Keep Functions Small**: Aim for under 20 lines per function
7. **Use Meaningful Names**: Code should be self-documenting

## Feature Development Workflow

When building a new feature, create files in this order:

1. **Validation** (`validations/feature.validation.js`) - Define input schemas
2. **Repository** (`repositories/feature.repository.js`) - Database queries
3. **Service** (`services/feature.service.js`) - Business logic
4. **Controller** (`controllers/feature.controller.js`) - Request handlers
5. **Routes** (`routes/feature.routes.js`) - API endpoints
6. **Tests** - Unit and integration tests

## Utilities

### asyncHandler

Wraps async functions to catch errors:

```javascript
import { asyncHandler } from '../utils/asyncHandler.js';

export const getUser = asyncHandler(async (req, res) => {
  // Your async code here
});
```

### AppError

Custom error class for operational errors:

```javascript
import AppError from '../utils/AppError.js';

throw new AppError('User not found', 404);
```

### Response Helpers

Consistent response formatting:

```javascript
import { sendSuccess, sendError } from '../utils/response.js';

sendSuccess(res, userData);
sendError(res, 'Something went wrong', 500);
```

## Example: Complete Feature Implementation

### 1. Validation
```javascript
// src/validations/interview.validation.js
import { z } from 'zod';

export const createInterviewSchema = z.object({
  title: z.string().min(1),
  duration: z.number().positive(),
});
```

### 2. Repository
```javascript
// src/repositories/interview.repository.js
import prisma from '../config/prisma.js';

export const interviewRepository = {
  async create(data) {
    return await prisma.interview.create({ data });
  },
};
```

### 3. Service
```javascript
// src/services/interview.service.js
import { interviewRepository } from '../repositories/interview.repository.js';

export const interviewService = {
  async createInterview(userId, data) {
    return await interviewRepository.create({
      ...data,
      userId,
    });
  },
};
```

### 4. Controller
```javascript
// src/controllers/interview.controller.js
import { asyncHandler } from '../utils/asyncHandler.js';
import { interviewService } from '../services/interview.service.js';

export const createInterview = asyncHandler(async (req, res) => {
  const interview = await interviewService.createInterview(
    req.user.id,
    req.body
  );
  
  res.status(201).json({
    success: true,
    data: interview,
  });
});
```

### 5. Routes
```javascript
// src/routes/interview.routes.js
import express from 'express';
import { createInterview } from '../controllers/interview.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createInterview);

export default router;
```

## Best Practices

1. **Always validate input** using Zod schemas
2. **Check ownership** before allowing operations
3. **Use transactions** for multi-step database operations
4. **Log important events** but not sensitive data
5. **Write tests** for all business logic
6. **Document complex logic** with comments
7. **Keep dependencies minimal** in each layer
8. **Use environment variables** for configuration
9. **Never commit secrets** to version control
10. **Follow consistent patterns** across all features

## Testing Strategy

- **Unit Tests**: Test services and repositories in isolation
- **Integration Tests**: Test complete request/response cycles
- **E2E Tests**: Test critical user flows

## Security Considerations

- Always authenticate protected routes
- Validate and sanitize all inputs
- Never expose sensitive data in responses
- Use parameterized queries (Prisma handles this)
- Implement rate limiting for public endpoints
- Use HTTPS in production
- Keep dependencies updated

## Performance Tips

- Use database indexes appropriately
- Implement pagination for large datasets
- Cache frequently accessed data
- Use connection pooling (Prisma does this)
- Avoid N+1 queries
- Profile and optimize slow queries

---

This architecture ensures:
- ✅ Clean separation of concerns
- ✅ Easy to test
- ✅ Easy to maintain
- ✅ Scalable
- ✅ Consistent patterns
