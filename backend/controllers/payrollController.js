// Controllers for payroll operations

const { asyncHandler } = require('../middleware/errorHandler');
const PayrollService = require('../services/payrollService');
const { HTTP_STATUS } = require('../constants');

// GET /api/payroll/:userId
const getPayroll = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const payroll = PayrollService.getPayroll(userId);
  res.status(HTTP_STATUS.OK).json(payroll);
});

// GET /api/payroll/:userId/summary
const getPayrollSummary = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const summary = PayrollService.getPayrollSummary(userId);
  res.status(HTTP_STATUS.OK).json(summary);
});

module.exports = { getPayroll, getPayrollSummary };
