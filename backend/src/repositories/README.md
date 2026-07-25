# Repositories

Repositories handle all database operations using Prisma.

## Responsibilities

- All Prisma queries
- CRUD operations
- Database transactions
- Query optimization

## Do NOT

- Implement business logic
- Return HTTP responses
- Validate business rules

## Example

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
  
  async update(userId, data) {
    return await prisma.user.update({
      where: { id: userId },
      data,
    });
  },
  
  async delete(userId) {
    return await prisma.user.delete({
      where: { id: userId },
    });
  },
};
```

## Naming Convention

- File: `feature.repository.js`
- Export: `featureRepository` object with methods
- Methods: `findById`, `findMany`, `create`, `update`, `delete`
