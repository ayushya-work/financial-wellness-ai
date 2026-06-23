// Controllers for AI operations

const { asyncHandler } = require('../middleware/errorHandler');
const { validateAIQuery } = require('../validators');
const { queryAI } = require('../utils/aiClient');
const { generateDocumentQAPrompt } = require('../utils/aiPrompts');
const PayslipService = require('../services/payslipService');
const Logger = require('../utils/logger');
const { HTTP_STATUS } = require('../constants');

const logger = new Logger('AIController');

// POST /api/ai/ask
const askAI = asyncHandler(async (req, res) => {
  const { prompt, pdfBase64 } = validateAIQuery(req);
  const userId = req.user.id;

  try {
    // Get user's payslip context
    let payslipContext = '';
    try {
      const payslip = PayslipService.getPayslip(userId);
      payslipContext = JSON.stringify(payslip, null, 2);
    } catch (err) {
      logger.info('No payslip found for user, proceeding without context', { userId });
    }

    // Generate grounded prompt
    const groundedPrompt = generateDocumentQAPrompt(prompt, {}, payslipContext);

    // Query AI with grounded prompt
    const response = await queryAI(groundedPrompt, pdfBase64 || null, userId);

    logger.info('AI query processed', { userId, promptLength: prompt.length });

    res.status(HTTP_STATUS.OK).json({
      question: prompt,
      answer: response,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    logger.error('AI query failed', { userId, error: err.message });
    throw err;
  }
});

module.exports = { askAI };
