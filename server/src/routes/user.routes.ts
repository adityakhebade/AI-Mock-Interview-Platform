import { Router } from 'express';
import {
  getCurrentUserContext,
  getMe,
  syncUser,
  updateMe,
} from '../controllers/user.controller.js';
import { requireCurrentUser } from '../middleware/clerk.middleware.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema } from '../validations/user.validation.js';
import { z } from 'zod';

const router = Router();

router.use(requireCurrentUser);

router.post('/sync', syncUser);
router.get('/me', getMe);
router.patch(
  '/me',
  validate(z.object({ body: updateProfileSchema })),
  updateMe
);

export const userTestRouter = Router();
userTestRouter.use(requireCurrentUser);
userTestRouter.get('/context', getCurrentUserContext);

export default router;
