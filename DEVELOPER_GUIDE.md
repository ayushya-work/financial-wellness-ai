# Developer Quick Reference Guide

## Getting Started

### Prerequisites
```bash
Node.js v14+
npm v6+
```

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install
npm install --save-dev jest supertest

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# Backend
cd backend
cp ../.env.example .env
# Edit .env with your values:
# - AI_TOKEN (required)
# - PORT (default: 5000)
# - NODE_ENV (default: development)
```

### 3. Start Application

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npm start
```

---

## Project Structure Quick Reference

### Backend Route → Service Flow

```
GET /api/payroll/u001 (with Bearer token)
    ↓
routes/payroll.js (validates token + ownership)
    ↓
controllers/payrollController.js (getPayroll function)
    ↓
services/payrollService.js (PayrollService.getPayroll)
    ↓
data/payroll.json (lookup)
    ↓
Response: { earnings: {...}, deductions: {...}, ... }
```

### Error Flow

```
Service throws AppError
    ↓
Controller's asyncHandler catches it
    ↓
Global errorHandler in middleware/errorHandler.js
    ↓
Logs: { timestamp, level, module, userId, message }
    ↓
Response: { error: { message, type, statusCode, timestamp } }
```

---

## Common Tasks

### Adding a New Endpoint

**Example: New endpoint GET /api/payroll/:userId/ytd**

1. **Add service method** (`services/payrollService.js`):
```javascript
static getYTDSummary(userId) {
  const payroll = this.getPayroll(userId);
  return {
    grossYTD: payroll.ytd.grossSalary,
    netYTD: payroll.ytd.netSalary,
    pfContribution: payroll.ytd.providentFundContribution
  };
}
```

2. **Add controller** (`controllers/payrollController.js`):
```javascript
const getYTDSummary = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const summary = PayrollService.getYTDSummary(userId);
  res.status(HTTP_STATUS.OK).json(summary);
});

module.exports = { getPayroll, getPayrollSummary, getYTDSummary };
```

3. **Add route** (`routes/payroll.js`):
```javascript
router.get('/:userId/ytd', getYTDSummary);
```

### Adding Validation

**Example: Validate input for new AI feature**

1. **Add validator** (`validators/index.js`):
```javascript
const validateSalaryQuery = (req) => {
  const { month, year } = req.body;
  
  if (!month || month < 1 || month > 12) {
    throw new AppError('Month must be 1-12', HTTP_STATUS.BAD_REQUEST);
  }
  if (!year || year < 2020) {
    throw new AppError('Year must be 2020 or later', HTTP_STATUS.BAD_REQUEST);
  }
  return { month, year };
};

module.exports = { validateLoginRequest, validatePayslipUpload, validateAIQuery, validateSalaryQuery };
```

2. **Use in controller**:
```javascript
const querySalary = asyncHandler(async (req, res) => {
  const { month, year } = validateSalaryQuery(req);
  // ... process request
});
```

### Adding Logging

**In any file**:
```javascript
const Logger = require('../utils/logger');
const logger = new Logger('MyModule');

logger.info('Operation successful', { userId, amount });
logger.error('Operation failed', { userId, error: err.message });
```

**Output** (automatically JSON):
```json
{
  "timestamp": "2024-06-23T10:30:45.123Z",
  "level": "INFO",
  "module": "MyModule",
  "message": "Operation successful",
  "userId": "u001",
  "amount": 50000
}
```

### Throwing Custom Errors

```javascript
const { HTTP_STATUS, ERROR_TYPES } = require('../constants');
const AppError = require('../utils/appError');

// Basic error
throw new AppError('Something went wrong');

// With status code
throw new AppError('Not found', HTTP_STATUS.NOT_FOUND);

// With error type
throw new AppError(
  'User already exists',
  HTTP_STATUS.CONFLICT,
  ERROR_TYPES.VALIDATION_ERROR
);

// With details
throw new AppError(
  'Payslip parsing failed',
  HTTP_STATUS.BAD_REQUEST,
  ERROR_TYPES.VALIDATION_ERROR,
  { details: 'Invalid PDF format' }
);
```

---

## Configuration Reference

### config/index.js - Key Settings

```javascript
port: 5000                              // Server port
nodeEnv: 'development'                  // Environment
corsOrigin: 'http://localhost:3000'     // CORS allowed origin
aiServiceUrl: '...'                     // External AI service
aiServiceToken: 'xxx'                   // AI auth token
logLevel: 'info'                        // Log level (debug, info, warn, error)
maxUploadSize: '10mb'                   // Max upload size
features: {
  mockOcr: true,                        // Use mock OCR
  auditLogging: false                   // Enable audit logs
}
```

### constants/index.js - Available Constants

```javascript
HTTP_STATUS.OK / NOT_FOUND / BAD_REQUEST / UNAUTHORIZED / ...
ERROR_TYPES.VALIDATION_ERROR / AUTH_ERROR / NOT_FOUND_ERROR / ...
SALARY_COMPONENTS.BASIC / HRA / LTA / SPECIAL_ALLOWANCE / ...
TAX_SECTIONS.SECTION_80C / SECTION_80CCD / SECTION_80D / SECTION_24 / ...
USER_ROLES.EMPLOYEE / HR / ADMIN
PROOF_STATUS.RECEIVED / MISSING / PENDING
```

---

## Testing

### Unit Test Template (Services)

```javascript
const PayrollService = require('../services/payrollService');

describe('PayrollService', () => {
  describe('calculateGross', () => {
    it('should sum all earnings', () => {
      const earnings = { basic: 30000, hra: 15000, bonus: 5000 };
      const result = PayrollService.calculateGross(earnings);
      expect(result).toBe(50000);
    });

    it('should handle missing fields', () => {
      const earnings = { basic: 30000 };
      const result = PayrollService.calculateGross(earnings);
      expect(result).toBe(30000);
    });
  });
});
```

### Integration Test Template (Routes)

```javascript
const request = require('supertest');
const app = require('../server');
const { generateToken } = require('../middleware/auth');

describe('GET /api/payroll/:userId', () => {
  it('should return payroll for authenticated user', async () => {
    const token = generateToken('u001');
    const res = await request(app)
      .get('/api/payroll/u001')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('earnings');
    expect(res.body.earnings.basicSalary).toBe(30000);
  });

  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/payroll/u001');
    expect(res.status).toBe(401);
  });

  it('should return 403 accessing other user data', async () => {
    const token = generateToken('u001');
    const res = await request(app)
      .get('/api/payroll/u002')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });
});
```

### Running Tests

```bash
# Install test dependencies
npm install --save-dev jest supertest

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- services/payrollService.test.js

# Watch mode (re-run on changes)
npm test -- --watch
```

---

## Environment Variables

### Required
```bash
AI_TOKEN=your_ai_service_token_here
```

### Optional (have defaults)
```bash
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
USE_MOCK_OCR=true
ENABLE_AUDIT_LOG=false
```

---

## Frontend Configuration

### src/services/api.js

```javascript
// Axios instance with automatic token injection
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Automatically adds: Authorization: Bearer {token}
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Environment

```bash
# .env in frontend/
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Troubleshooting

### "Cannot find module" Error

**Problem**: `Error: Cannot find module '../services/authService'`

**Solution**:
1. Check file path spelling (case-sensitive on Linux/Mac)
2. Verify file exists in correct directory
3. Check that require/import path is relative correctly

### "Token validation failed"

**Problem**: 401 error on protected routes

**Solution**:
1. Ensure token is stored in localStorage on frontend
2. Check Authorization header format: `Bearer token_...`
3. Verify token was issued by login endpoint
4. Check token exists in backend's tokenStore

### "No payroll data found"

**Problem**: 404 error on /api/payroll/:userId

**Solution**:
1. Verify userId exists in `backend/data/users.json`
2. Verify userData exists in `backend/data/payroll.json`
3. Check that authenticated user's userId matches requested userId

### "CORS error"

**Problem**: Cross-Origin Request Blocked

**Solution**:
1. Check `CORS_ORIGIN` in `.env` matches frontend URL
2. For localhost development: `CORS_ORIGIN=http://localhost:3000`
3. Restart backend after changing `.env`

---

## Performance Tips

### Logging
```javascript
// ✅ Good: Log important operations only
logger.info('User authenticated', { userId });

// ❌ Bad: Logging every line
logger.debug('Checking user in array');
logger.debug('User found');
logger.debug('Generating token');
```

### Database Queries (when implemented)
```javascript
// ✅ Good: Use indexes, select needed columns
SELECT id, name, email FROM users WHERE id = ?;

// ❌ Bad: SELECT all columns unnecessarily
SELECT * FROM users;
```

### Error Handling
```javascript
// ✅ Good: Specific error messages
throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);

// ❌ Bad: Generic errors, swallowed exceptions
try { ... } catch(e) { console.log('error'); }
```

---

## Code Style Guidelines

### Variable Naming
```javascript
✅ const userPayroll = ...
✅ const isUserAuthenticated = ...
✅ const calculateGross = ...

❌ const up = ...
❌ const d = ...
❌ const calc = ...
```

### Function Structure
```javascript
✅ async function processPayslip(userId, file) {
  // Input validation
  validatePayslipInput(userId, file);
  
  // Business logic
  const parsed = parseFile(file);
  const stored = storePayslip(userId, parsed);
  
  // Return
  return stored;
}

❌ async function process(u, f) {
  return storePayslip(u, parseFile(f));
}
```

### Comments
```javascript
✅ // Calculate gross salary from all earnings components
const gross = earnings.basic + earnings.hra + earnings.bonus;

❌ // Add up earnings
const gross = a + b + c;
```

---

## Deployment Checklist

- [ ] All tests passing
- [ ] No console.log (use logger instead)
- [ ] .env configured with real values
- [ ] NODE_ENV=production
- [ ] Enable password hashing (bcrypt)
- [ ] Setup database (replace JSON)
- [ ] Configure Redis for tokens
- [ ] Setup logging aggregation
- [ ] Enable request compression
- [ ] Configure HTTPS
- [ ] Setup monitoring
- [ ] Database backups configured
- [ ] Secrets management configured

---

## Additional Resources

📚 [Full Architecture Guide](ARCHITECTURE.md)
📚 [Architecture Transformation Report](ARCHITECTURE_TRANSFORMATION.md)
📚 [Main README](README.md)
🔗 [Express.js Guide](https://expressjs.com/)
🔗 [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
🔗 [Axios Documentation](https://axios-http.com/)
