// Controllers for payslip operations

const { asyncHandler } = require('../middleware/errorHandler');
const { validatePayslipUpload } = require('../validators');
const PayslipService = require('../services/payslipService');
const { HTTP_STATUS } = require('../constants');

// POST /api/payslip/upload
const uploadPayslip = asyncHandler(async (req, res) => {
  const { fileBase64 } = validatePayslipUpload(req);
  const userId = req.user.id;
  
  const parsed = PayslipService.uploadPayslip(userId, fileBase64);
  res.status(HTTP_STATUS.CREATED).json({
    message: 'Payslip uploaded successfully',
    parsed
  });
});

// GET /api/payslip/:userId
const getPayslip = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const payslip = PayslipService.getPayslip(userId);
  res.status(HTTP_STATUS.OK).json(payslip);
});

module.exports = { uploadPayslip, getPayslip };
