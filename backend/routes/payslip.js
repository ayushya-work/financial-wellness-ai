const express = require('express');
const router = express.Router();
const { parsePayslip } = require('../utils/ocrMock');
const { validateToken, ensureUserOwnership } = require('../middleware/auth');

let uploadedPayslips = {}; // in-memory store per user

// Upload payslip - requires authentication
router.post('/upload', validateToken, (req, res) => {
  const { fileBase64 } = req.body;
  const userId = req.user.id; // Use authenticated user's ID
  
  if (!fileBase64) {
    return res.status(400).json({ error: "Missing file data" });
  }
  
  const parsed = parsePayslip(fileBase64);
  uploadedPayslips[userId] = parsed;
  res.json({ message: "Payslip uploaded successfully", parsed });
});

// Retrieve payslip - requires authentication and ownership check
router.get('/:userId', validateToken, ensureUserOwnership, (req, res) => {
  const payslip = uploadedPayslips[req.params.userId];
  if (!payslip) return res.status(404).json({ error: "No payslip found. Please upload first." });
  res.json(payslip);
});

module.exports = router;
