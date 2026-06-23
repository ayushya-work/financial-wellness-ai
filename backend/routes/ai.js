const express = require('express');
const router = express.Router();
const { queryAI } = require('../utils/aiClient');
const { validateToken } = require('../middleware/auth');

// AI query endpoint - requires authentication
router.post('/ask', validateToken, async (req, res) => {
  const { prompt, pdfBase64 } = req.body;
  const userId = req.user.id; // Authenticated user
  
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    // In production, would fetch user's actual uploaded payslip context
    const response = await queryAI(prompt, pdfBase64, userId);
    res.json(response);
  } catch (err) {
    console.error('AI query error:', err.message);
    res.status(500).json({ error: "AI query failed", details: err.message });
  }
});

module.exports = router;
