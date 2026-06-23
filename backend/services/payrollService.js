// Business logic for payroll operations

const payrollData = require('../data/payroll.json');
const AppError = require('../utils/appError');
const { HTTP_STATUS, ERROR_TYPES } = require('../constants');
const Logger = require('../utils/logger');

const logger = new Logger('PayrollService');

class PayrollService {
  /**
   * Get payroll data for a user
   * @param {string} userId
   * @returns {Object} payroll data
   * @throws {AppError}
   */
  static getPayroll(userId) {
    const data = payrollData[userId];

    if (!data) {
      logger.warn('Payroll data not found', { userId });
      throw new AppError(
        'No payroll data found',
        HTTP_STATUS.NOT_FOUND,
        ERROR_TYPES.NOT_FOUND_ERROR
      );
    }

    logger.info('Payroll data retrieved', { userId });
    return data;
  }

  /**
   * Calculate gross salary
   * @param {Object} earnings
   * @returns {number}
   */
  static calculateGross(earnings) {
    return Object.values(earnings).reduce((sum, val) => sum + (val || 0), 0);
  }

  /**
   * Calculate net salary
   * @param {number} gross
   * @param {Object} deductions
   * @returns {number}
   */
  static calculateNet(gross, deductions) {
    const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + (val || 0), 0);
    return Math.max(0, gross - totalDeductions);
  }

  /**
   * Get payroll summary
   * @param {string} userId
   * @returns {Object} summary with key metrics
   */
  static getPayrollSummary(userId) {
    const payroll = this.getPayroll(userId);
    return {
      month: payroll.month,
      year: payroll.year,
      employee: payroll.employeeName,
      basicSalary: payroll.earnings.basicSalary,
      gross: payroll.summary.grossSalary,
      deductions: payroll.summary.totalDeductions,
      net: payroll.summary.netSalary,
      ytdGross: payroll.ytd.grossSalary,
      ytdNet: payroll.ytd.netSalary
    };
  }
}

module.exports = PayrollService;
