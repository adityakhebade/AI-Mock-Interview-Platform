import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/response.js';

class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';
  const isOperational =
    err instanceof AppError ? err.isOperational : false;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  const response: ApiResponse = {
    success: false,
    message,
    errors: isOperational ? [message] : ['An unexpected error occurred'],
  };

  res.status(statusCode).json(response);
};

const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const response: ApiResponse = {
    success: false,
    message: `Route ${req.originalUrl} not found`,
    errors: ['The requested resource does not exist'],
  };

  res.status(404).json(response);
};

export { AppError, errorHandler, notFoundHandler };
