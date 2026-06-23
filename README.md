# Financial Wellness AI - Employee Payslip Assistant

A secure, AI-powered financial wellness assistant that helps employees understand their salary structure, deductions, reimbursements, and tax-saving opportunities through document-grounded explanations.

## 🎯 Overview

This application addresses the challenge of payslip complexity by providing:
- **Document-Grounded AI Explanations** — Answers grounded only in employee's payslip and payroll data
- **Salary Component Breakdowns** — Simple explanations of HRA, LTA, PF, and other components
- **Tax-Saving Simulations** — Estimates potential savings from Section 80C investments
- **Investment Proof Checklists** — Auto-generated checklist of required documents for tax filing
- **User-Level Security** — Strict access control ensuring employees see only their own data

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│  │   Login      │ │   Dashboard  │ │  Upload      │             │
│  │   Page       │ │              │ │  Payslip     │             │
│  └──────────────┘ └──────────────┘ └──────────────┘             │
│                                                                  │
└──────────────────────────┬───────────────────────────────────────┘
                           │ (Bearer Token)
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Backend API (Express.js)                      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Middleware: Token Validation & User Ownership Check     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│  ┌──────────┐ ┌──────────┐ ┌────────┐ ┌─────────┐ ┌────────┐   │
│  │  Auth    │ │ Payslip  │ │Payroll │ │ AI      │ │Checklist   │
│  │  Routes  │ │  Routes  │ │Routes  │ │ Routes  │ │ Routes │   │
│  └──────────┘ └──────────┘ └────────┘ └─────────┘ └────────┘   │
│       ↓              ↓           ↓         ↓          ↓         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Utilities:                                               │   │
│  │ • ocrMock.js - Payslip parsing & formatting             │   │
│  │ • aiPrompts.js - Grounded AI prompts with safeguards    │   │
│  │ • investmentChecklist.js - Tax proof requirements       │   │
│  │ • aiClient.js - AI wrapper service integration          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Data Layer:                                              │   │
│  │ • data/users.json - Employee profiles                   │   │
│  │ • data/payroll.json - Structured payroll data           │   │
│  │ • In-memory: uploadedPayslips, tokenStore               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                           ↓
                    ┌──────────────┐
                    │  External AI │
                    │  Service     │
                    │  (LLM)       │
                    └──────────────┘
```

---

## 📋 Features Implemented

### ✅ Core Features
1. **Employee Authentication**
   - User login with unique ID (u001, u002)
   - Secure Bearer token generation per session
   - Token validation on all protected routes

2. **Payslip Upload & Parsing**
   - File upload endpoint (PDF/image support)
   - Mock OCR extraction with realistic data
   - Structured payslip data with components, deductions, reimbursements, YTD values

3. **Payroll Data Query**
   - Monthly salary breakup (earnings, deductions, reimbursements)
   - Year-to-date aggregates
   - User-level access control

4. **AI-Powered Explanations**
   - Document-grounded answers (payslip-only sourcing)
   - Grounding rules to prevent hallucination
   - Source attribution ("According to your payslip...")
   - Safe refusal when data unavailable

5. **Salary Component Explanations**
   - Simple explanations of HRA, LTA, Special Allowance, PF, etc.
   - Uses actual values from payslip
   - Employee-friendly language

6. **Tax-Saving Simulations**
   - Section 80C investment simulation
   - Estimated tax savings calculation
   - Simplified assumptions with clear caveats
   - Step-by-step breakdown

7. **Investment Proof Checklist**
   - Auto-generated based on declared deductions
   - Lists required documents for tax filing
   - Marks received vs. missing proofs
   - Organized by tax section (80C, 80D, 24, etc.)

### 🔒 Security & Privacy
- **Bearer Token Authentication** — All protected routes require valid token
- **User Ownership Validation** — Cannot access other employees' data
- **Token-Based Session** — In-memory store tracks token→userId mapping
- **Authorization Errors** — Clear 401/403 responses for unauthorized access
- **No Cross-User Leakage** — Payslip/payroll endpoints validate user ownership

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- React development environment
- OpenAI API key or compatible LLM service (for AI features)

### Installation

1. **Clone & Navigate**
   ```bash
   cd financial-wellness-ai
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   echo "PORT=5000" > .env
   echo "AI_TOKEN=your_actual_token_here" >> .env
   
   npm start
   # Server runs on http://localhost:5000
   ```

3. **Frontend Setup** (in new terminal)
   ```bash
   cd frontend
   npm install
   
   # Set API URL if backend on different port
   echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
   
   npm start
   # App runs on http://localhost:3000
   ```

---

## 📖 API Documentation

### Authentication

**POST /api/auth/login**
```json
Request:
{
  "userId": "u001"
}

Response:
{
  "token": "token_u001_1719068400000_abc123xyz",
  "user": {
    "id": "u001",
    "name": "Ayushya Sharma",
    "email": "ayushya@example.com",
    "role": "employee"
  }
}
```

All subsequent requests require:
```
Authorization: Bearer token_u001_1719068400000_abc123xyz
```

### Payroll Endpoints

**GET /api/payroll/:userId**
Returns monthly salary breakup, deductions, and YTD values.
```json
Response:
{
  "basic": 30000,
  "hra": 15000,
  "lta": 5000,
  "pf": 3600,
  "professionalTax": 200,
  "gross": 50000,
  "net": 45000,
  "ytd": { "gross": 600000, "net": 540000 }
}
```

### Payslip Endpoints

**POST /api/payslip/upload**
Upload payslip for OCR extraction.
```json
Request:
{
  "fileBase64": "JVBERi0xLjQK..."
}

Response:
{
  "message": "Payslip uploaded successfully",
  "parsed": { ... full payslip object ... }
}
```

**GET /api/payslip/:userId**
Retrieve last uploaded payslip.

### AI Endpoints

**POST /api/ai/ask**
Ask document-grounded questions about salary.
```json
Request:
{
  "prompt": "Why is my net salary lower this month?",
  "pdfBase64": "optional_payslip_pdf"
}

Response:
{
  "answer": "According to your payslip, your net salary is lower because..."
}
```

---

## 🧪 Testing & Edge Cases

### Test Scenarios

1. **Authorization**
   - ✓ Login with u001 → get token
   - ✓ Use u001 token to access u002 data → 403 Forbidden
   - ✓ Missing token → 401 Unauthorized
   - ✓ Expired/invalid token → 401 Unauthorized

2. **Payslip Processing**
   - ✓ Upload payslip → parsed and stored
   - ✓ Retrieve uploaded payslip → exact format returned
   - ✓ Retrieve without upload → 404 Not Found
   - ✓ Upload with missing fields → still processes

3. **AI Grounding**
   - ✓ Ask about salary component → cites payslip values
   - ✓ Ask about unavailable data → refuses with "not available in payslip"
   - ✓ Request tax advice → clarifies "simplified simulation, not advice"
   - ✓ Invalid question → graceful refusal

4. **Investment Checklist**
   - ✓ Generate for user with Section 80C → lists LIC, PPF, etc.
   - ✓ Mark received/missing proofs → status updates
   - ✓ Calculate completion %  → accurate totals

### Sample Test Users
```
u001: Ayushya Sharma
u002: Ravi Kumar
```

---

## 📊 Data Model

### User (users.json)
```json
{
  "id": "u001",
  "name": "Ayushya Sharma",
  "email": "ayushya@example.com",
  "role": "employee"
}
```

### Payroll (payroll.json)
```json
{
  "u001": {
    "basic": 30000,
    "hra": 15000,
    "lta": 5000,
    "pf": 3600,
    "professionalTax": 200,
    "gross": 50000,
    "net": 45000,
    "ytd": { "gross": 600000, "net": 540000 }
  }
}
```

### Enhanced Payslip (returned by /payslip/upload)
```json
{
  "month": "June",
  "year": 2024,
  "payPeriod": "2024-06-01 to 2024-06-30",
  "earnings": {
    "basicSalary": 30000,
    "houseRentAllowance": 15000,
    "learningTrainingAllowance": 5000,
    "specialAllowance": 5000,
    "performanceBonus": 2000,
    "grossEarnings": 57000
  },
  "deductions": {
    "providentFund": 3600,
    "professionalTax": 200,
    "incomeTaxDeducted": 6400,
    "totalDeductions": 11400
  },
  "reimbursements": {
    "conveyance": 800,
    "mobile": 500,
    "medicineExpense": 1200,
    "travelExpense": 2500,
    "totalReimbursements": 5000
  },
  "ytd": {
    "grossSalary": 342000,
    "deductions": 68400,
    "netSalary": 303600,
    "providentFundContribution": 21600
  },
  "taxDeclaration": {
    "section80C": { "epf": 21600, "lic": 15000, "ppf": 30000 },
    "section80D": { "selfMedical": 15000, "parentMedical": 10000 },
    "section24": { "homeInterest": 40000 }
  }
}
```

---

## 🛡️ Security Assumptions

### Implemented
✅ User-level access control via Bearer tokens  
✅ Token validation on all protected routes  
✅ Ownership check (can't access other users' data)  
✅ Clear authorization error codes (401, 403)  

### Production Considerations (Not Implemented)
⚠️ JWT signing/verification (currently using in-memory tokens)  
⚠️ Token expiration & refresh logic  
⚠️ Encrypted payslip storage  
⚠️ Audit logging of data access  
⚠️ HTTPS-only communication  
⚠️ Rate limiting on uploads  
⚠️ Encryption at rest for sensitive data  

---

## 🎨 AI Prompt Strategy

All AI responses follow grounding rules in `backend/utils/aiPrompts.js`:

1. **Source-Only Sourcing** — Only information from payslip/payroll data
2. **Refusal Rules** — Decline if data unavailable or request is outside scope
3. **Attribution** — Every claim cites source ("According to your payslip...")
4. **Hallucination Prevention** — Never invent values; show exact numbers
5. **Simple Language** — Employee-friendly explanations, avoid jargon

Example:
```javascript
const prompt = generateSalaryExplanationPrompt(
  'HRA',
  payslipData,
  'Ayushya Sharma'
);
// Output includes grounding rules + specific instructions
```

---

## 📈 Bonus Features (Not Yet Implemented)

- [ ] Payslip month-to-month comparison
- [ ] Source-cited AI answers with field references
- [ ] Calculation explainability (show formula steps)
- [ ] Audit logging of user queries & document access
- [ ] Admin/Payroll support view (read-only, filtered)
- [ ] Enhanced UI with charts & visualizations

---

## ⚠️ Limitations & Assumptions

1. **Simplified Tax Logic**
   - Section 80C flat 20% tax rate (actual depends on income bracket)
   - No consideration of marginal tax rates
   - Investment limits shown but not enforced

2. **Mock Data**
   - OCR parsing is simulated (no actual PDF processing)
   - Payroll data is static JSON (not live from HRIS)
   - Tax declarations are mock values

3. **LLM Integration**
   - Requires external LLM service (configured via AI_TOKEN)
   - Responses depend on model's compliance with grounding rules
   - No built-in validation of AI response accuracy

4. **Storage**
   - In-memory payslip storage (lost on server restart)
   - In-memory token store (sessions don't persist)
   - No database persistence

---

## 🔄 Workflow Example

```
1. Employee opens app
   → Sees Login page

2. Employee enters ID (u001)
   → Receives Bearer token
   → Token stored in localStorage

3. Employee on Dashboard
   → Can upload payslip
   → Can query payroll data
   → Can ask AI questions
   → Can view investment checklist

4. Employee asks "Why is my HRA 15000?"
   → System retrieves their payslip
   → AI formats grounded prompt
   → LLM returns: "According to your payslip, HRA is ₹15,000 which is 50% of your basic salary of ₹30,000"

5. Employee requests tax simulation
   → Inputs ₹50,000 80C investment
   → System calculates: potential tax saving ₹10,000 (simplified)
   → Shows caveat: "This is a simulation, not tax advice"

6. Employee views investment proof checklist
   → System lists all declared deductions
   → Shows required documents per item
   → Marks completed/missing proofs
```

---

## 📞 Support & Documentation

For setup issues, refer to:
- Backend: `backend/server.js` for configuration
- Frontend: `frontend/package.json` for dependencies
- Routes: `backend/routes/*.js` for API details
- Data: `backend/data/*.json` for sample data

---

## 📄 License

This is a prototype implementation for educational/demonstration purposes.

---

## 🙋 FAQ

**Q: Can employee A see employee B's payslip?**  
A: No. Token validation + user ownership check prevent cross-user access.

**Q: What happens if AI model gives wrong tax advice?**  
A: All responses should include caveat: "This is a simulation based on simplified assumptions. Consult a CA for actual tax planning."

**Q: How are payslips stored?**  
A: Currently in-memory. Production would use encrypted database with audit logs.

**Q: Can I use my real payroll data?**  
A: Yes, replace mock data in `data/payroll.json` and update `ocrMock.js` to parse real PDFs.

**Q: Is this production-ready?**  
A: No. This is a secure prototype. Production requires encryption, real DB, audit logging, and compliance certifications.

---

## 🎓 Architecture Highlights

✅ **Separation of Concerns** — Routes, middleware, utilities, data layers clearly separated  
✅ **Grounded AI** — All LLM prompts include grounding rules and source attribution  
✅ **User Privacy** — Token-based access control prevents data leakage  
✅ **Clear Error Handling** — Specific HTTP codes for auth, validation, not-found errors  
✅ **Reusable Utilities** — Prompt templates, checklist generators are modular  
✅ **Frontend Interception** — API client auto-attaches Bearer tokens to all requests
