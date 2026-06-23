// Business logic for authentication

const users = require('../data/users.json');
const { generateToken } = require('../middleware/auth');
const AppError = require('../utils/appError');
const { HTTP_STATUS, ERROR_TYPES } = require('../constants');
const Logger = require('../utils/logger');

const logger = new Logger('AuthService');

class AuthService {
  /**
   * Authenticate user with userId and password
   * @param {string} userId - Employee user ID
   * @param {string} password - Employee password
   * @returns {Object} { token, user }
   * @throws {AppError}
   */
  static authenticate(userId, password) {
    const user = users.find(u => u.id === userId);

    if (!user) {
      logger.warn('Login attempt with invalid userId', { userId });
      throw new AppError(
        'Invalid user ID or password',
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_TYPES.AUTH_ERROR
      );
    }

    // In production: use bcrypt.compare()
    if (user.password !== password) {
      logger.warn('Login attempt with wrong password', { userId });
      throw new AppError(
        'Invalid user ID or password',
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_TYPES.AUTH_ERROR
      );
    }

    logger.info('User authenticated successfully', { userId });

    // Generate token
    const token = generateToken(userId);

    // Return user without password
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  /**
   * Get user by ID (for verification)
   * @param {string} userId
   * @returns {Object} user object
   */
  static getUserById(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new AppError(
        'User not found',
        HTTP_STATUS.NOT_FOUND,
        ERROR_TYPES.NOT_FOUND_ERROR
      );
    }
    return user;
  }
}

module.exports = AuthService;
