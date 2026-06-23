/**
 * Financial Wellness AI - Backend Server
 * 
 * Enterprise-grade Node.js/Express application with:
 * - Layered architecture (Controllers → Services → Data)
 * - Centralized error handling
 * - Structured logging
 * - Input validation
 * - Security middleware (auth, CORS)
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Configuration & Constants
const config = require('./config');
const Logger = require('./utils/logger');

// Middleware
const { validateToken, ensureUserOwnership } = require('./middleware/auth');
const { errorHandler, asyncHandler } = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth');
const payslipRoutes = require('./routes/payslip');
const payrollRoutes = require('./routes/payroll');
const aiRoutes = require('./routes/ai');
const checklistRoutes = require('./routes/checklist');

// Initialize app
const app = express();
const logger = new Logger('Server');

// CORS Configuration
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser Middleware
app.use(express.json({ limit: config.maxUploadSize }));
app.use(express.urlencoded({ limit: config.maxUploadSize, extended: true }));

// Request Logging Middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { userId: req.user?.id });
  next();
});

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/payslip', payslipRoutes);
apiRouter.use('/payroll', payrollRoutes);
apiRouter.use('/ai', aiRoutes);
apiRouter.use('/checklist', checklistRoutes);

app.use(`${config.apiPrefix}`, apiRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString()
    }
  });
});

// Global Error Handler (must be last)
app.use(errorHandler);

// Server Startup
const PORT = config.port;
const server = app.listen(PORT, () => {
  logger.info('Server started successfully', {
    port: PORT,
    environment: config.nodeEnv,
    corsOrigin: config.corsOrigin
  });
  console.log(`\n🚀 Financial Wellness AI Server running on port ${PORT}`);
  console.log(`📍 Environment: ${config.nodeEnv}`);
  console.log(`🔗 CORS Origin: ${config.corsOrigin}\n`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { message: err.message, stack: err.stack });
  process.exit(1);
});

module.exports = app;

