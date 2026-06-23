// Global error handling middleware

const Logger = require('../utils/logger');
const AppError = require('../utils/appError');
const { HTTP_STATUS } = require('../constants');

const logger = new Logger('ErrorHandler');

const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error('Unhandled error', {
    message: err.message,
    statusCode: err.statusCode || 500,
    path: req.path,
    method: req.method,
    userId: req.user?.id,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Handle AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: {
        message: 'Validation failed',
        type: 'VALIDATION_ERROR',
        details: err.details || err.message
      }
    });
  }

  // Handle unexpected errors
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    error: {
      message: 'Internal server error',
      type: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && {
        details: err.message,
        stack: err.stack
      })
    }
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandler, asyncHandler, AppError };
