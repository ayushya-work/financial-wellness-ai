// Controllers - HTTP request handlers

const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { validateLoginRequest } = require('../validators');
const AuthService = require('../services/authService');
const Logger = require('../utils/logger');
const { HTTP_STATUS } = require('../constants');

const logger = new Logger('AuthController');

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { userId, password } = validateLoginRequest(req);
  const result = AuthService.authenticate(userId, password);
  
  res.status(HTTP_STATUS.OK).json(result);
});

module.exports = { login };
