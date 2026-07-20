# Backend Architecture Reference

## Layer Flow

```
HTTP Request
    ↓
Route Definition (routes/)
    ↓
Controller (controllers/)
    ↓
Service (services/)
    ↓
Repository (repositories/)
    ↓
Prisma Client
    ↓
PostgreSQL Database
```

## Responsibilities

### Routes (`src/routes/`)

**Purpose**: Define API endpoints and apply middleware

**Rules**:
- Define HTTP methods (GET, POST, PUT, DELETE)
- Apply route-specific middleware
- Mount controllers
- No business logic
- No database access

**Example**:
```typescript
import { Router } from 'express';
import { getUsers, createUser } from '../controllers/user.controller.js';
import { validateRequest } from '../middleware/validator.js';
import { userSchema } from '../validators/user.validator.js';

const router = Router();

router.get('/', getUsers);
router.post('/', validateRequest(userSchema), createUser);

export default router;
```

---

### Controllers (`src/controllers/`)

**Purpose**: Handle HTTP requests and responses

**Rules**:
- Parse request parameters, body, query
- Call service methods
- Return HTTP responses
- Use standard response format
- No business logic
- No database access
- Handle HTTP-specific concerns only

**Example**:
```typescript
import { Request, Response } from 'express';
import { ApiResponse } from '../types/response.js';
import { userService } from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  
  const response: ApiResponse = {
    success: true,
    message: 'Users retrieved successfully',
    data: users,
  };
  
  res.status(200).json(response);
});
```

---

### Services (`src/services/`)

**Purpose**: Implement business logic

**Rules**:
- Contain all business rules
- Orchestrate multiple repositories
- Handle validation logic
- Coordinate external services (Cloudinary, Clerk)
- Throw AppError for business rule violations
- Never access HTTP request/response objects
- Never import from controllers

**Example**:
```typescript
import { AppError } from '../middleware/errorHandler.js';
import { userRepository } from '../repositories/user.repository.js';

export const userService = {
  async getAllUsers() {
    return await userRepository.findAll();
  },

  async createUser(data: CreateUserDto) {
    // Business logic
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    // Validation
    if (!data.email.includes('@')) {
      throw new AppError('Invalid email format', 400);
    }

    return await userRepository.create(data);
  },
};
```

---

### Repositories (`src/repositories/`)

**Purpose**: Database operations only

**Rules**:
- Perform CRUD operations
- Use Prisma client only
- No business logic
- No validation
- No authorization checks
- Return raw data from database
- Throw errors only for database failures

**Example**:
```typescript
import prisma from '../config/prisma.js'; // Will be created with Prisma setup

export const userRepository = {
  async findAll() {
    return await prisma.user.findMany();
  },

  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  async create(data: CreateUserData) {
    return await prisma.user.create({
      data,
    });
  },

  async update(id: string, data: UpdateUserData) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return await prisma.user.delete({
      where: { id },
    });
  },
};
```

---

### Middleware (`src/middleware/`)

**Purpose**: Cross-cutting concerns

**Types**:
- Authentication: Verify JWT tokens
- Authorization: Check permissions
- Validation: Validate request data
- Error handling: Catch and format errors
- Logging: Log HTTP requests
- Security: CORS, Helmet, rate limiting

**Example**:
```typescript
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler.js';

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new AppError('No token provided', 401);
    }

    // Verify token with Clerk
    const userId = await verifyToken(token);
    req.userId = userId;
    
    next();
  } catch (error) {
    next(error);
  }
};
```

---

### Validators (`src/validators/`)

**Purpose**: Define request validation schemas using Zod

**Rules**:
- Use Zod for schema definition
- Validate request body, params, query
- Export schemas for middleware use
- Keep validation rules in one place

**Example**:
```typescript
import { z } from 'zod';

export const userSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    age: z.number().int().positive().optional(),
  }),
});

export const userIdSchema = z.object({
  params: z.object({
    id: z.string().cuid(),
  }),
});
```

---

## Standard Response Format

### Success

```typescript
const response: ApiResponse = {
  success: true,
  message: 'Operation successful',
  data: {
    // Your data here
  },
};

res.status(200).json(response);
```

### Error

```typescript
throw new AppError('Error message', 400);
// Will be caught by error handler and formatted as:
{
  "success": false,
  "message": "Error message",
  "errors": ["Error message"]
}
```

---

## HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation errors, invalid input |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Valid auth but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists, constraint violation |
| 500 | Internal Server Error | Unexpected server errors |

---

## Error Handling

### Throwing Errors

```typescript
// In services
throw new AppError('User not found', 404);
throw new AppError('Invalid credentials', 401);
throw new AppError('Email already exists', 409);
```

### Catching Errors

Use `asyncHandler` wrapper for async routes:

```typescript
import { asyncHandler } from '../utils/asyncHandler.js';

export const myController = asyncHandler(async (req, res) => {
  // Your code - errors automatically caught and passed to error handler
});
```

---

## Adding a New Feature

### Step-by-Step

1. **Define Route** (`routes/feature.routes.ts`)
   ```typescript
   import { Router } from 'express';
   import { getItems, createItem } from '../controllers/feature.controller.js';
   
   const router = Router();
   router.get('/', getItems);
   router.post('/', createItem);
   export default router;
   ```

2. **Create Validator** (`validators/feature.validator.ts`)
   ```typescript
   import { z } from 'zod';
   
   export const createItemSchema = z.object({
     body: z.object({
       name: z.string().min(1),
     }),
   });
   ```

3. **Implement Controller** (`controllers/feature.controller.ts`)
   ```typescript
   export const getItems = asyncHandler(async (req, res) => {
     const items = await featureService.getAll();
     res.status(200).json({
       success: true,
       message: 'Items retrieved',
       data: items,
     });
   });
   ```

4. **Add Service** (`services/feature.service.ts`)
   ```typescript
   export const featureService = {
     async getAll() {
       return await featureRepository.findAll();
     },
   };
   ```

5. **Create Repository** (`repositories/feature.repository.ts`)
   ```typescript
   export const featureRepository = {
     async findAll() {
       return await prisma.item.findMany();
     },
   };
   ```

6. **Mount Route** (`routes/index.ts`)
   ```typescript
   import featureRouter from './feature.routes.js';
   router.use('/features', featureRouter);
   ```

---

## Best Practices

### DO

✓ Keep functions small and focused  
✓ Use TypeScript types for everything  
✓ Handle errors with AppError  
✓ Use asyncHandler for async routes  
✓ Validate all inputs  
✓ Return consistent response format  
✓ Check ownership in services  
✓ Keep repositories simple (CRUD only)  
✓ Use environment variables for config  
✓ Write meaningful commit messages  

### DON'T

✗ Put business logic in controllers  
✗ Access database from controllers  
✗ Put validation in services  
✗ Access HTTP objects from services  
✗ Mix concerns across layers  
✗ Hardcode values  
✗ Ignore errors  
✗ Leave TODO comments  
✗ Commit sensitive data  
✗ Break the layer hierarchy  

---

## Common Patterns

### Pagination

```typescript
// Controller
const { page = 1, limit = 10 } = req.query;
const result = await service.getPaginated(+page, +limit);

// Service
async getPaginated(page: number, limit: number) {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    repository.findMany(skip, limit),
    repository.count(),
  ]);
  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

### Ownership Check

```typescript
// Service
async getUserResume(userId: string, resumeId: string) {
  const resume = await resumeRepository.findById(resumeId);
  
  if (!resume) {
    throw new AppError('Resume not found', 404);
  }
  
  if (resume.userId !== userId) {
    throw new AppError('Unauthorized access', 403);
  }
  
  return resume;
}
```

### Transaction

```typescript
// Service with Prisma transaction
async createInterview(userId: string, data: CreateInterviewDto) {
  return await prisma.$transaction(async (tx) => {
    const interview = await tx.interview.create({
      data: { ...data, userId },
    });
    
    await tx.interviewHistory.create({
      data: { interviewId: interview.id, action: 'created' },
    });
    
    return interview;
  });
}
```

---

## Environment Variables

Always access through `config/index.ts`:

```typescript
// config/index.ts
export default {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL!,
  clerkSecretKey: process.env.CLERK_SECRET_KEY!,
};

// Usage in services
import config from '../config/index.js';
const port = config.port; // Never use process.env directly
```
