// Controllers for investment checklist

const { asyncHandler } = require('../middleware/errorHandler');
const { generateInvestmentChecklist, formatChecklistReport } = require('../utils/investmentChecklist');
const PayrollService = require('../services/payrollService');
const { HTTP_STATUS } = require('../constants');

// GET /api/checklist/:userId
const getChecklist = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const payroll = PayrollService.getPayroll(userId);

  // Mock tax declaration
  const taxDeclaration = {
    section80C: {
      epf: payroll.ytd?.providentFundContribution || 0,
      lic: 15000,
      ppf: 30000
    },
    section80CCD: { nps: 20000 },
    section80D: {
      selfMedical: 15000,
      parentMedical: 10000
    },
    section24: { homeInterest: 40000 }
  };

  const proofStatus = {
    'section80C_epf': { received: true, receiptDate: '2024-06-30' },
    'section80C_lic': { received: false },
    'section80C_ppf': { received: true, receiptDate: '2024-06-15' },
    'section80D_selfMedical': { received: false }
  };

  const checklist = generateInvestmentChecklist(taxDeclaration, proofStatus);
  res.status(HTTP_STATUS.OK).json(checklist);
});

// GET /api/checklist/:userId/report
const getChecklistReport = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const payroll = PayrollService.getPayroll(userId);

  const taxDeclaration = {
    section80C: {
      epf: payroll.ytd?.providentFundContribution || 0,
      lic: 15000,
      ppf: 30000
    },
    section80CCD: { nps: 20000 },
    section80D: {
      selfMedical: 15000,
      parentMedical: 10000
    },
    section24: { homeInterest: 40000 }
  };

  const proofStatus = {
    'section80C_epf': { received: true, receiptDate: '2024-06-30' },
    'section80C_lic': { received: false },
    'section80C_ppf': { received: true, receiptDate: '2024-06-15' }
  };

  const checklist = generateInvestmentChecklist(taxDeclaration, proofStatus);
  const report = formatChecklistReport(checklist);

  res.type('text/plain').send(report);
});

module.exports = { getChecklist, getChecklistReport };
