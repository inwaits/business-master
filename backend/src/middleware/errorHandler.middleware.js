const { createError } = require('../utils/helpers');

/**
 * Global error handler middleware
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Prisma errors
  if (err.code && err.code.startsWith('P')) {
    return handlePrismaError(err, res);
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json(
      createError('VALIDATION_ERROR', 'Validation failed', err.details)
    );
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json(
      createError('UNAUTHORIZED', 'Invalid or expired token')
    );
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json(
    createError(
      err.code || 'INTERNAL_SERVER_ERROR',
      message,
      process.env.NODE_ENV === 'development' ? err.stack : undefined
    )
  );
}

/**
 * Handle Prisma-specific errors
 */
function handlePrismaError(err, res) {
  switch (err.code) {
    case 'P2002':
      // Unique constraint violation
      const field = err.meta?.target?.[0] || 'field';
      return res.status(409).json(
        createError('CONFLICT', `${field} already exists`)
      );

    case 'P2025':
      // Record not found
      return res.status(404).json(
        createError('NOT_FOUND', 'Record not found')
      );

    case 'P2003':
      // Foreign key constraint failed
      return res.status(400).json(
        createError('BAD_REQUEST', 'Invalid reference')
      );

    default:
      return res.status(500).json(
        createError('DATABASE_ERROR', 'Database operation failed')
      );
  }
}

/**
 * Async error wrapper
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Not found error
 */
class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
    this.code = 'NOT_FOUND';
  }
}

/**
 * Validation error
 */
class ValidationError extends Error {
  constructor(message = 'Validation failed', details = null) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.code = 'VALIDATION_ERROR';
    this.details = details;
  }
}

/**
 * Unauthorized error
 */
class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
    this.code = 'UNAUTHORIZED';
  }
}

/**
 * Forbidden error
 */
class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
    this.code = 'FORBIDDEN';
  }
}

/**
 * Conflict error
 */
class ConflictError extends Error {
  constructor(message = 'Resource conflict') {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
    this.code = 'CONFLICT';
  }
}

module.exports = {
  errorHandler,
  asyncHandler,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
};

