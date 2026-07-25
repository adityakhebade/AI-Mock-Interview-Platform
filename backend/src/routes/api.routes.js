import express from 'express';

const router = express.Router();

// API v1 routes will be registered here
// Example:
// import authRoutes from './auth.routes.js';
// import userRoutes from './user.routes.js';
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);

// Health check for API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'API v1 is healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
