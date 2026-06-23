/**
 * Payroll Routes
 * GET /api/payroll/:userId - Get payroll data
 * GET /api/payroll/:userId/summary - Get payroll summary
 */

const express = require('express');
const { getPayroll, getPayrollSummary } = require('../controllers/payrollController');
const { validateToken, ensureUserOwnership } = require('../middleware/auth');

const router = express.Router();

// All payroll routes require authentication and ownership check
router.use(validateToken);
router.use('/:userId', ensureUserOwnership);

// GET /api/payroll/:userId
router.get('/:userId', getPayroll);

// GET /api/payroll/:userId/summary
router.get('/:userId/summary', getPayrollSummary);

module.exports = router;
