/**
 * Payslip Routes
 * POST /api/payslip/upload - Upload payslip for OCR
 * GET /api/payslip/:userId - Get uploaded payslip
 */

const express = require('express');
const { uploadPayslip, getPayslip } = require('../controllers/payslipController');
const { validateToken, ensureUserOwnership } = require('../middleware/auth');

const router = express.Router();

// POST /upload - Upload payslip (requires authentication)
router.post('/upload', validateToken, uploadPayslip);

// GET /:userId - Retrieve payslip (requires authentication and ownership)
router.get('/:userId', validateToken, ensureUserOwnership, getPayslip);

module.exports = router;
