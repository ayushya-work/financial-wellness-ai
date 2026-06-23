// Custom error class for consistent error handling

const { HTTP_STATUS, ERROR_TYPES } = require('../constants');

class AppError extends Error {
  constructor(
    message,
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errorType = ERROR_TYPES.INTERNAL_ERROR,
    details = {}
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.details = details;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      error: {
        message: this.message,
        type: this.errorType,
        statusCode: this.statusCode,
        timestamp: this.timestamp,
        ...(process.env.NODE_ENV === 'development' && { details: this.details })
      }
    };
  }
}

module.exports = AppError;
