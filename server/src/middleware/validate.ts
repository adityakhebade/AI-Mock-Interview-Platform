import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './errorHandler.js';
import { ErrorCode } from '../types/errors.js';

export const validate =
  (schema: ZodSchema) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));

        next(
          new AppError(
            `Validation failed: ${messages.map((m) => m.message).join(', ')}`,
            400,
            ErrorCode.VALIDATION_ERROR,
            messages
          )
        );
        return;
      }
      next(error);
    }
  };
