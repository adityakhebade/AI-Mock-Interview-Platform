# Controllers

Controllers handle HTTP requests and responses.

## Responsibilities

- Receive HTTP requests
- Extract data from req.body, req.params, req.query
- Call service functions
- Send JSON responses

## Do NOT

- Write business logic
- Query database directly
- Call Prisma

## Example

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

## Naming Convention

- File: `feature.controller.js`
- Functions: `getFeature`, `createFeature`, `updateFeature`, `deleteFeature`
