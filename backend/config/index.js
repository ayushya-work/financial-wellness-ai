// Backend configuration management
// Centralizes all environment-based configuration

const config = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // API
  apiVersion: 'v1',
  apiPrefix: '/api',
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // AI Service
  aiServiceUrl: process.env.AI_SERVICE_URL || 'https://llm-wrapper-741152993481.asia-south1.run.app/llm/query',
  aiServiceToken: process.env.AI_TOKEN,
  
  // Security
  tokenPrefix: 'token',
  tokenExpiry: process.env.TOKEN_EXPIRY || '24h',
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // Validation
  maxUploadSize: '10mb',
  
  // Features
  features: {
    mockOcr: process.env.USE_MOCK_OCR !== 'false',
    auditLogging: process.env.ENABLE_AUDIT_LOG === 'true',
  }
};

// Ensure required env vars are set
if (!config.aiServiceToken) {
  console.warn('⚠️  Warning: AI_TOKEN not set. AI features will fail.');
}

module.exports = config;
