import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import resumeRoutes from './resume.routes.js';
import interviewRoutes from './interview.routes.js';
import questionRoutes from './question.routes.js';

const router = express.Router();

// API v1 routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/resumes', resumeRoutes);
router.use('/interviews', interviewRoutes);
router.use('/questions', questionRoutes);

// Health check for API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'API v1 is healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
