import { Request, Response } from 'express';
import { ApiResponse } from '../types/response.js';

export const healthCheck = (_req: Request, res: Response): void => {
  const response: ApiResponse = {
    success: true,
    message: 'Server is running',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    },
  };

  res.status(200).json(response);
};
