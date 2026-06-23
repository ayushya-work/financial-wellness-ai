// Input validation utilities

const { HTTP_STATUS, ERROR_TYPES } = require('../constants');
const AppError = require('../utils/appError');

const validateLoginRequest = (req) => {
  const { userId, password } = req.body;

  if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
    throw new AppError(
      'User ID is required and must be a non-empty string',
      HTTP_STATUS.BAD_REQUEST,
      ERROR_TYPES.VALIDATION_ERROR
    );
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    throw new AppError(
      'Password is required and must be at least 6 characters',
      HTTP_STATUS.BAD_REQUEST,
      ERROR_TYPES.VALIDATION_ERROR
    );
  }

  return { userId: userId.trim(), password };
};

const validatePayslipUpload = (req) => {
  const { fileBase64 } = req.body;

  if (!fileBase64) {
    throw new AppError(
      'File data is required',
      HTTP_STATUS.BAD_REQUEST,
      ERROR_TYPES.VALIDATION_ERROR
    );
  }

  if (typeof fileBase64 !== 'string') {
    throw new AppError(
      'Invalid file format',
      HTTP_STATUS.BAD_REQUEST,
      ERROR_TYPES.VALIDATION_ERROR
    );
  }

  return { fileBase64 };
};

const validateAIQuery = (req) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    throw new AppError(
      'Prompt is required and must be a non-empty string',
      HTTP_STATUS.BAD_REQUEST,
      ERROR_TYPES.VALIDATION_ERROR
    );
  }

  return { prompt: prompt.trim(), pdfBase64: req.body.pdfBase64 };
};

module.exports = {
  validateLoginRequest,
  validatePayslipUpload,
  validateAIQuery
};
