# Services

Services contain business logic and orchestrate data operations.

## Responsibilities

- Business rules and validation
- Ownership checks
- Data transformation
- Orchestrate multiple repository calls
- State management

## Do NOT

- Handle HTTP requests/responses
- Call Prisma directly
- Return Express response objects

## Example

```javascript
import { userRepository } from '../repositories/user.repository.js';
import AppError from '../utils/AppError.js';

export const userService = {
  async getUserById(userId) {
    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  },
};
```

## Naming Convention

- File: `feature.service.js`
- Export: `featureService` object with methods
