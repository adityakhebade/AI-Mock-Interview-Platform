import { Router } from 'express';
import healthRouter from './health.routes.js';
import userRouter, { userTestRouter } from './user.routes.js';

const router = Router();

router.use('/health', healthRouter);
router.use('/users', userRouter);

if (process.env.NODE_ENV === 'test') {
  router.use('/test/users', userTestRouter);
}

export default router;
