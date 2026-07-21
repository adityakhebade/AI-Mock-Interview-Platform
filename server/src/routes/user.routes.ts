import { Router } from 'express';
import {
  getCurrentUserContext,
  getMe,
  syncUser,
} from '../controllers/user.controller.js';
import { requireCurrentUser } from '../middleware/clerk.middleware.js';

const router = Router();

router.use(requireCurrentUser);

router.post('/sync', syncUser);
router.get('/me', getMe);

export const userTestRouter = Router();
userTestRouter.use(requireCurrentUser);
userTestRouter.get('/context', getCurrentUserContext);

export default router;
