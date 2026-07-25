import express from 'express';
import apiRoutes from './api.routes.js';

const router = express.Router();

// Base route - Welcome message
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'IntervueX Backend Running',
    version: '1.0.0',
    documentation: '/api/v1',
  });
});

// Legacy health check (kept for backward compatibility)
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'Healthy',
    timestamp: new Date().toISOString(),
  });
});

// API v1 routes
router.use('/api/v1', apiRoutes);

export default router;
