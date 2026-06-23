/**
 * Investment Checklist Routes
 * GET /api/checklist/:userId - Get investment proof checklist (JSON)
 * GET /api/checklist/:userId/report - Get formatted checklist report (text)
 */

const express = require('express');
const { getChecklist, getChecklistReport } = require('../controllers/checklistController');
const { validateToken, ensureUserOwnership } = require('../middleware/auth');

const router = express.Router();

// All checklist routes require authentication and ownership check
router.use(validateToken);
router.use('/:userId', ensureUserOwnership);

// GET /api/checklist/:userId
router.get('/:userId', getChecklist);

// GET /api/checklist/:userId/report
router.get('/:userId/report', getChecklistReport);

module.exports = router;
