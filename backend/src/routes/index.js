import express from 'express';

const router = express.Router();

// Base route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'IntervueX Backend Running',
  });
});

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'Healthy',
  });
});

export default router;
