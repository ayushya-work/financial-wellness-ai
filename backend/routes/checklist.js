const express = require('express');
const router = express.Router();
const { validateToken } = require('../middleware/auth');
const { generateInvestmentChecklist, formatChecklistReport } = require('../utils/investmentChecklist');
const payrollData = require('../data/payroll.json');

// Generate investment proof checklist for authenticated user
router.get('/:userId', validateToken, (req, res) => {
  const userId = req.params.userId;
  
  // Verify user ownership
  if (req.user.id !== userId) {
    return res.status(403).json({ error: "Unauthorized: Cannot access other user's data" });
  }

  const payroll = payrollData[userId];
  if (!payroll) {
    return res.status(404).json({ error: "No payroll data found for this user" });
  }

  // For mock, assume all tax declarations exist
  const taxDeclaration = {
    section80C: {
      epf: payroll.ytd?.providentFundContribution || 0,
      lic: 15000,
      ppf: 30000,
      total: 66600,
      limit: 150000
    },
    section80CCD: {
      nps: 20000
    },
    section80D: {
      selfMedical: 15000,
      parentMedical: 10000,
      total: 25000
    },
    section24: {
      homeInterest: 40000
    }
  };

  // Mock proof status (in production, would query actual proof storage)
  const proofStatus = {
    'section80C_epf': { received: true, receiptDate: '2024-06-30', notes: 'Form 16 received' },
    'section80C_lic': { received: false, notes: 'Awaiting LIC certificate' },
    'section80C_ppf': { received: true, receiptDate: '2024-06-15', notes: 'PPF passbook verified' },
    'section80D_selfMedical': { received: false, notes: 'Waiting for annual statement' }
  };

  try {
    const checklist = generateInvestmentChecklist(taxDeclaration, proofStatus);
    res.json(checklist);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate checklist", details: err.message });
  }
});

// Get formatted report (human-readable text version)
router.get('/:userId/report', validateToken, (req, res) => {
  const userId = req.params.userId;
  
  if (req.user.id !== userId) {
    return res.status(403).json({ error: "Unauthorized: Cannot access other user's data" });
  }

  const payroll = payrollData[userId];
  if (!payroll) {
    return res.status(404).json({ error: "No payroll data found for this user" });
  }

  const taxDeclaration = {
    section80C: {
      epf: payroll.ytd?.providentFundContribution || 0,
      lic: 15000,
      ppf: 30000
    },
    section80CCD: {
      nps: 20000
    },
    section80D: {
      selfMedical: 15000,
      parentMedical: 10000
    },
    section24: {
      homeInterest: 40000
    }
  };

  const proofStatus = {
    'section80C_epf': { received: true, receiptDate: '2024-06-30' },
    'section80C_lic': { received: false },
    'section80C_ppf': { received: true, receiptDate: '2024-06-15' },
    'section80D_selfMedical': { received: false }
  };

  try {
    const checklist = generateInvestmentChecklist(taxDeclaration, proofStatus);
    const report = formatChecklistReport(checklist);
    res.type('text/plain').send(report);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate report", details: err.message });
  }
});

module.exports = router;
