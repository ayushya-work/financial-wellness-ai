const express = require('express');
const router = express.Router();
const payrollData = require('../data/payroll.json');
const { validateToken, ensureUserOwnership } = require('../middleware/auth');

// All payroll routes require authentication and user ownership check
router.get('/:userId', validateToken, ensureUserOwnership, (req, res) => {
  const data = payrollData[req.params.userId];
  if (!data) return res.status(404).json({ error: "No payroll data found" });
  res.json(data);
});

module.exports = router;
