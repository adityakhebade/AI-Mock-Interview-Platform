import { z } from 'zod';

/**
 * Validation Middleware Factory
 * 
 * Creates middleware to validate request data using Zod schemas.
 */

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Validate request body
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Validation error',
      });
    }
  };
};

export const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      // Validate query parameters
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Query validation failed',
          errors: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Validation error',
      });
    }
  };
};
