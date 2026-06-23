/**
 * AI Routes
 * POST /api/ai/ask - Ask document-grounded questions about salary
 */

const express = require('express');
const { askAI } = require('../controllers/aiController');
const { validateToken } = require('../middleware/auth');

const router = express.Router();

// POST /ask - Ask AI questions about salary (requires authentication)
router.post('/ask', validateToken, askAI);

module.exports = router;
