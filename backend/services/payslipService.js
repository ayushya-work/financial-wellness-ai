// Business logic for payslip operations

const { parsePayslip } = require('../utils/ocrMock');
const AppError = require('../utils/appError');
const { HTTP_STATUS, ERROR_TYPES } = require('../constants');
const Logger = require('../utils/logger');

const logger = new Logger('PayslipService');

// In-memory store for uploaded payslips (replace with DB in production)
const uploadedPayslips = {};

class PayslipService {
  /**
   * Upload and parse payslip
   * @param {string} userId
   * @param {string} fileBase64
   * @returns {Object} parsed payslip
   */
  static uploadPayslip(userId, fileBase64) {
    try {
      const parsed = parsePayslip(fileBase64);
      uploadedPayslips[userId] = {
        ...parsed,
        uploadedAt: new Date().toISOString()
      };

      logger.info('Payslip uploaded and parsed', { userId });
      return parsed;
    } catch (err) {
      logger.error('Payslip parsing failed', { userId, error: err.message });
      throw new AppError(
        'Failed to parse payslip',
        HTTP_STATUS.BAD_REQUEST,
        ERROR_TYPES.VALIDATION_ERROR,
        { details: err.message }
      );
    }
  }

  /**
   * Get uploaded payslip for user
   * @param {string} userId
   * @returns {Object} payslip
   * @throws {AppError}
   */
  static getPayslip(userId) {
    const payslip = uploadedPayslips[userId];

    if (!payslip) {
      logger.warn('Payslip not found', { userId });
      throw new AppError(
        'No payslip found. Please upload first.',
        HTTP_STATUS.NOT_FOUND,
        ERROR_TYPES.NOT_FOUND_ERROR
      );
    }

    logger.info('Payslip retrieved', { userId });
    return payslip;
  }

  /**
   * Delete payslip for user (cleanup)
   * @param {string} userId
   */
  static deletePayslip(userId) {
    if (uploadedPayslips[userId]) {
      delete uploadedPayslips[userId];
      logger.info('Payslip deleted', { userId });
    }
  }
}

module.exports = PayslipService;
