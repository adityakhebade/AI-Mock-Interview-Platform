import { Request, Response, NextFunction } from 'express';
import { ErrorCode, type ApiErrorResponse } from '../types/errors.js';
import type { ApiResponse } from '../types/response.js';

class AppError extends Error {
  statusCode: number;
  code: string;
  isOperational: boolean;
  details?: unknown;

  constructor(
    message: string,
    statusCode: number,
    code: string = ErrorCode.INTERNAL_ERROR,
    details?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.details = details;

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
  let code: string = ErrorCode.INTERNAL_ERROR;
  let message = 'Internal server error';
  let details: unknown;
  const isOperational = err instanceof AppError ? err.isOperational : false;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: code as ApiErrorResponse['error']['code'],
      message,
      ...(details !== undefined ? { details } : {}),
    },
  };

  if (!isOperational && process.env.NODE_ENV === 'development') {
    response.error.message = err.message;
  }

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
