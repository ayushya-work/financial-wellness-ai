# API Reference

## Overview

All endpoints require authentication (Bearer token) unless otherwise noted.

**Base URL**: `http://localhost:5000/api`

**Authentication Header**: `Authorization: Bearer {token}`

---

## Authentication

### POST /auth/login

Authenticate user and receive token for subsequent requests.

**Request:**
```json
{
  "userId": "u001",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "token_u001_1624354245_abc123",
  "user": {
    "id": "u001",
    "name": "Rajesh Kumar",
    "email": "rajesh.kumar@company.com",
    "role": "employee"
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "error": {
    "message": "Invalid user ID or password",
    "type": "AUTH_ERROR",
    "statusCode": 401,
    "timestamp": "2024-06-23T10:30:45.123Z"
  }
}
```

**Demo Credentials:**
- User: `u001`, Password: `password123`
- User: `u002`, Password: `password123`

---

## Payroll

### GET /payroll/:userId

Get complete payroll data for authenticated user.

**Headers:**
```
Authorization: Bearer token_u001_...
```

**Response (200 OK):**
```json
{
  "month": "June",
  "year": 2024,
  "employeeId": "u001",
  "employeeName": "Rajesh Kumar",
  "earnings": {
    "basicSalary": 30000,
    "houseRentAllowance": 15000,
    "learningTrainingAllowance": 5000,
    "specialAllowance": 3000,
    "performanceBonus": 7000
  },
  "deductions": {
    "providentFund": 3600,
    "professionalTax": 200,
    "incomeTaxDeducted": 5000
  },
  "summary": {
    "grossSalary": 60000,
    "totalDeductions": 8800,
    "netSalary": 51200
  },
  "ytd": {
    "grossSalary": 360000,
    "deductions": 52800,
    "netSalary": 307200,
    "providentFundContribution": 21600
  }
}
```

**Error (403 Forbidden):**
```json
{
  "error": {
    "message": "You cannot access other user's data",
    "type": "PERMISSION_ERROR",
    "statusCode": 403,
    "timestamp": "2024-06-23T10:30:45.123Z"
  }
}
```

---

### GET /payroll/:userId/summary

Get payroll summary (condensed view).

**Response (200 OK):**
```json
{
  "month": "June",
  "year": 2024,
  "employee": "Rajesh Kumar",
  "basicSalary": 30000,
  "gross": 60000,
  "deductions": 8800,
  "net": 51200,
  "ytdGross": 360000,
  "ytdNet": 307200
}
```

---

## Payslip

### POST /payslip/upload

Upload payslip file for OCR parsing.

**Headers:**
```
Authorization: Bearer token_u001_...
Content-Type: application/json
```

**Request:**
```json
{
  "fileBase64": "JVBERi0xLjQKJeLj..."  // Base64 encoded PDF
}
```

**Response (201 Created):**
```json
{
  "message": "Payslip uploaded successfully",
  "parsed": {
    "earnings": {
      "basicSalary": 30000,
      "houseRentAllowance": 15000,
      "learningTrainingAllowance": 5000,
      "specialAllowance": 3000,
      "performanceBonus": 7000
    },
    "deductions": {
      "providentFund": 3600,
      "professionalTax": 200,
      "incomeTaxDeducted": 5000
    },
    "reimbursements": {
      "conveyance": 1600,
      "mobile": 1000,
      "medicineExpense": 500,
      "travelExpense": 2000
    },
    "summary": {
      "grossSalary": 60000,
      "totalDeductions": 8800,
      "netSalary": 51200
    },
    "ytd": {
      "grossSalary": 360000,
      "deductions": 52800,
      "netSalary": 307200,
      "providentFundContribution": 21600
    },
    "taxDeclaration": {
      "section80C": {
        "epf": 21600,
        "lic": 15000,
        "ppf": 30000,
        "total": 66600,
        "limit": 150000
      },
      "section80CCD": {
        "nps": 20000,
        "limit": 50000
      },
      "section80D": {
        "selfMedical": 15000,
        "parentMedical": 10000,
        "limit": 25000
      },
      "section24": {
        "homeInterest": 40000,
        "limit": 200000
      }
    }
  }
}
```

---

### GET /payslip/:userId

Retrieve uploaded payslip for authenticated user.

**Response (200 OK):**
```json
{
  "earnings": { ... },
  "deductions": { ... },
  "reimbursements": { ... },
  "summary": { ... },
  "ytd": { ... },
  "taxDeclaration": { ... },
  "uploadedAt": "2024-06-23T10:30:45.123Z"
}
```

**Error (404 Not Found):**
```json
{
  "error": {
    "message": "No payslip found. Please upload first.",
    "type": "NOT_FOUND_ERROR",
    "statusCode": 404,
    "timestamp": "2024-06-23T10:30:45.123Z"
  }
}
```

---

## AI Queries

### POST /ai/ask

Ask AI questions about salary, tax, and financial data.

**Headers:**
```
Authorization: Bearer token_u001_...
Content-Type: application/json
```

**Request:**
```json
{
  "prompt": "Explain my house rent allowance",
  "pdfBase64": "JVBERi0xLjQKJeLj..."  // Optional: payslip PDF for context
}
```

**Response (200 OK):**
```json
{
  "question": "Explain my house rent allowance",
  "answer": "House Rent Allowance (HRA) is a component of your salary meant to help with housing expenses. You receive ₹15,000 per month, which is 50% of your basic salary of ₹30,000. HRA is taxable and must be declared in your income tax return.",
  "timestamp": "2024-06-23T10:30:45.123Z"
}
```

**Features:**
- Grounded in user's actual payslip data
- Prevents hallucination with source-only responses
- Includes disclaimers for financial advice

---

## Investment Checklist

### GET /checklist/:userId

Get investment proof checklist for tax sections.

**Response (200 OK):**
```json
{
  "userId": "u001",
  "taxYear": 2024,
  "sections": [
    {
      "section": "section80C",
      "limit": 150000,
      "declared": 66600,
      "items": [
        {
          "type": "epf",
          "amount": 21600,
          "proofRequired": "Form 16",
          "status": "RECEIVED",
          "receiptDate": "2024-06-30"
        },
        {
          "type": "lic",
          "amount": 15000,
          "proofRequired": "Policy Statement",
          "status": "MISSING"
        },
        {
          "type": "ppf",
          "amount": 30000,
          "proofRequired": "Passbook",
          "status": "RECEIVED",
          "receiptDate": "2024-06-15"
        }
      ]
    },
    {
      "section": "section80CCD",
      "limit": 50000,
      "declared": 20000,
      "items": [
        {
          "type": "nps",
          "amount": 20000,
          "proofRequired": "NPS Statement",
          "status": "PENDING"
        }
      ]
    },
    {
      "section": "section80D",
      "limit": 25000,
      "declared": 25000,
      "items": [
        {
          "type": "selfMedical",
          "amount": 15000,
          "proofRequired": "Medical Insurance Policy",
          "status": "MISSING"
        },
        {
          "type": "parentMedical",
          "amount": 10000,
          "proofRequired": "Medical Insurance Policy",
          "status": "RECEIVED",
          "receiptDate": "2024-06-20"
        }
      ]
    },
    {
      "section": "section24",
      "limit": 200000,
      "declared": 40000,
      "items": [
        {
          "type": "homeInterest",
          "amount": 40000,
          "proofRequired": "Bank Statement / Loan Documents",
          "status": "RECEIVED",
          "receiptDate": "2024-06-25"
        }
      ]
    }
  ],
  "summary": {
    "totalDeclared": 151600,
    "totalReceived": 4,
    "totalMissing": 2,
    "totalPending": 1
  },
  "generatedAt": "2024-06-23T10:30:45.123Z"
}
```

---

### GET /checklist/:userId/report

Get formatted checklist report (text format).

**Response (200 OK - text/plain):**
```
═════════════════════════════════════════════════════════════════
              INVESTMENT PROOF CHECKLIST - 2024
                    Employee: Rajesh Kumar
═════════════════════════════════════════════════════════════════

SECTION 80C - Deductions up to ₹150,000
─────────────────────────────────────────────────────────────────
Status: Declared ₹66,600 / Limit ₹150,000

  ✓ RECEIVED  Employee Provident Fund (EPF)
              Amount: ₹21,600
              Proof: Form 16
              Date: June 30, 2024

  ✗ MISSING   Life Insurance (LIC)
              Amount: ₹15,000
              Proof: Policy Statement
              Action: Submit LIC certificate

  ✓ RECEIVED  Public Provident Fund (PPF)
              Amount: ₹30,000
              Proof: Passbook
              Date: June 15, 2024

SECTION 80CCD - NPS Deductions up to ₹50,000
─────────────────────────────────────────────────────────────────
Status: Declared ₹20,000 / Limit ₹50,000

  ⏳ PENDING   National Pension System (NPS)
              Amount: ₹20,000
              Proof: NPS Statement
              Action: Awaiting statement

SECTION 80D - Health Insurance up to ₹25,000
─────────────────────────────────────────────────────────────────
Status: Declared ₹25,000 / Limit ₹25,000

  ✗ MISSING   Self Health Insurance
              Amount: ₹15,000
              Proof: Insurance Policy
              Action: Submit policy copy

  ✓ RECEIVED  Parent Health Insurance
              Amount: ₹10,000
              Proof: Insurance Policy
              Date: June 20, 2024

SECTION 24 - Home Loan Interest up to ₹200,000
─────────────────────────────────────────────────────────────────
Status: Declared ₹40,000 / Limit ₹200,000

  ✓ RECEIVED  Home Loan Interest
              Amount: ₹40,000
              Proof: Bank Statement / Loan Documents
              Date: June 25, 2024

═════════════════════════════════════════════════════════════════
SUMMARY
─────────────────────────────────────────────────────────────────
Total Declared:     ₹151,600
Proofs Received:    4
Proofs Missing:     2
Proofs Pending:     1

ACTION ITEMS:
  1. Submit LIC certificate (Section 80C)
  2. Submit self health insurance policy (Section 80D)
  3. Follow up on NPS statement (Section 80CCD)

═════════════════════════════════════════════════════════════════
Report Generated: June 23, 2024 10:30 AM
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": {
    "message": "Description of what went wrong",
    "type": "ERROR_TYPE",
    "statusCode": 400,
    "timestamp": "2024-06-23T10:30:45.123Z",
    "details": { }  // Only in development mode
  }
}
```

### Error Types

| Type | Status | Meaning |
|------|--------|---------|
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `AUTH_ERROR` | 401 | Authentication failed |
| `PERMISSION_ERROR` | 403 | User lacks access permission |
| `NOT_FOUND_ERROR` | 404 | Resource not found |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting (Future)

Current system has no rate limiting. Production deployment should implement:

```
- 100 requests per minute per IP
- 10 requests per minute per user for sensitive operations (upload, delete)
- 429 Too Many Requests error when exceeded
```

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userId":"u001","password":"password123"}'
```

### Get Payroll
```bash
curl -X GET http://localhost:5000/api/payroll/u001 \
  -H "Authorization: Bearer token_u001_..."
```

### Upload Payslip
```bash
# First encode PDF to base64
FILE_BASE64=$(base64 -i payslip.pdf)

curl -X POST http://localhost:5000/api/payslip/upload \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token_u001_..." \
  -d "{\"fileBase64\":\"$FILE_BASE64\"}"
```

### Ask AI
```bash
curl -X POST http://localhost:5000/api/ai/ask \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token_u001_..." \
  -d '{"prompt":"What is my HRA?"}'
```

### Get Checklist
```bash
curl -X GET http://localhost:5000/api/checklist/u001 \
  -H "Authorization: Bearer token_u001_..."
```

---

## Testing with Postman

1. Create collection: "Financial Wellness AI"
2. Set collection variable: `token` = (login response token)
3. Set collection variable: `baseUrl` = `http://localhost:5000/api`
4. Set collection variable: `userId` = `u001`

### Example Requests

**Login (with body)**
```
POST {{baseUrl}}/auth/login
{
  "userId": "u001",
  "password": "password123"
}

// Save token from response:
// pm.environment.set("token", pm.response.json().token);
```

**Get Payroll (with auth)**
```
GET {{baseUrl}}/payroll/{{userId}}
Authorization: Bearer {{token}}
```

---

## Response Headers

All responses include:

```
Content-Type: application/json
X-Response-Time: 45ms  // (if timing middleware added)
```

---

## Pagination (Future)

When implemented, queries will support:

```
GET /api/payroll?page=1&limit=20&sort=-month
```

Response format:
```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 127,
    "pages": 7
  }
}
```

---

## API Versioning (Future)

When needed, use URL versioning:

```
/api/v1/payroll/:userId      # Current version
/api/v2/payroll/:userId      # New version (if breaking changes)
```

---

## Webhook Support (Future)

Planned webhook events:
- `payslip.uploaded`
- `checklist.generated`
- `compliance.missing_proof`

---

## Further Documentation

📚 [Full Architecture Guide](ARCHITECTURE.md)
📚 [Developer Guide](DEVELOPER_GUIDE.md)
🔗 [Postman API Documentation Export](https://www.postman.com/)
