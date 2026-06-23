#!/bin/bash

# Setup Verification Script
# Verifies all required files are in place and application is ready to run

set -e

echo "═══════════════════════════════════════════════════════════════════"
echo "  Financial Wellness AI - Setup Verification"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
PASS=0
FAIL=0
WARN=0

check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $1"
    ((PASS++))
  else
    echo -e "${RED}✗${NC} $1 (MISSING)"
    ((FAIL++))
  fi
}

check_dir() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✓${NC} $1/"
    ((PASS++))
  else
    echo -e "${RED}✗${NC} $1/ (MISSING)"
    ((FAIL++))
  fi
}

check_npm_module() {
  if grep -q "$1" package.json 2>/dev/null; then
    echo -e "${GREEN}✓${NC} npm: $1"
    ((PASS++))
  else
    echo -e "${YELLOW}⚠${NC} npm: $1 (not in package.json)"
    ((WARN++))
  fi
}

echo "📂 Checking Directory Structure..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_dir "backend"
check_dir "backend/config"
check_dir "backend/constants"
check_dir "backend/middleware"
check_dir "backend/controllers"
check_dir "backend/services"
check_dir "backend/validators"
check_dir "backend/utils"
check_dir "backend/routes"
check_dir "backend/data"
check_dir "frontend"
check_dir "frontend/src"

echo ""
echo "📄 Checking Backend Files..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Config & Constants
check_file "backend/config/index.js"
check_file "backend/constants/index.js"

# Middleware
check_file "backend/middleware/auth.js"
check_file "backend/middleware/errorHandler.js"

# Controllers
check_file "backend/controllers/authController.js"
check_file "backend/controllers/payrollController.js"
check_file "backend/controllers/payslipController.js"
check_file "backend/controllers/aiController.js"
check_file "backend/controllers/checklistController.js"

# Services
check_file "backend/services/authService.js"
check_file "backend/services/payrollService.js"
check_file "backend/services/payslipService.js"

# Validators & Utils
check_file "backend/validators/index.js"
check_file "backend/utils/logger.js"
check_file "backend/utils/appError.js"
check_file "backend/utils/aiClient.js"
check_file "backend/utils/aiPrompts.js"
check_file "backend/utils/ocrMock.js"
check_file "backend/utils/investmentChecklist.js"

# Routes
check_file "backend/routes/auth.js"
check_file "backend/routes/payroll.js"
check_file "backend/routes/payslip.js"
check_file "backend/routes/ai.js"
check_file "backend/routes/checklist.js"

# Data & Server
check_file "backend/data/users.json"
check_file "backend/data/payroll.json"
check_file "backend/server.js"
check_file "backend/package.json"

echo ""
echo "📄 Checking Frontend Files..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_file "frontend/src/App.js"
check_file "frontend/src/pages/Login.js"
check_file "frontend/src/pages/Dashboard.js"
check_file "frontend/src/services/api.js"
check_file "frontend/package.json"

echo ""
echo "📄 Checking Documentation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_file "README.md"
check_file "ARCHITECTURE.md"
check_file "ARCHITECTURE_TRANSFORMATION.md"
check_file "DEVELOPER_GUIDE.md"
check_file "API_REFERENCE.md"
check_file ".env.example"

echo ""
echo "📦 Checking Backend Dependencies..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd backend 2>/dev/null && {
  check_npm_module "express"
  check_npm_module "cors"
  check_npm_module "dotenv"
  cd .. > /dev/null
} || echo -e "${RED}✗${NC} Cannot read backend/package.json"

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "📊 Summary"
echo "═══════════════════════════════════════════════════════════════════"
echo -e "  ${GREEN}Passed${NC}:  $PASS"
echo -e "  ${RED}Failed${NC}:  $FAIL"
echo -e "  ${YELLOW}Warning${NC}: $WARN"
echo ""

if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}✓ All required files present!${NC}"
  echo ""
  echo "🚀 Next Steps:"
  echo "  1. Install dependencies:"
  echo "     cd backend && npm install"
  echo "     cd ../frontend && npm install"
  echo ""
  echo "  2. Configure environment:"
  echo "     cd backend"
  echo "     cp ../.env.example .env"
  echo "     # Edit .env with your AI_TOKEN"
  echo ""
  echo "  3. Start application:"
  echo "     # Terminal 1: Backend"
  echo "     cd backend && npm start"
  echo ""
  echo "     # Terminal 2: Frontend"
  echo "     cd frontend && npm start"
  echo ""
else
  echo -e "${RED}✗ Some required files are missing!${NC}"
  echo "Please ensure all files listed above are present."
  exit 1
fi
