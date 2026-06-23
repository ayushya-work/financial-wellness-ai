// Application-wide constants and enums

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

const ERROR_TYPES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  PERMISSION_ERROR: 'PERMISSION_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
};

const SALARY_COMPONENTS = {
  BASIC: 'basic',
  HRA: 'houseRentAllowance',
  LTA: 'learningTrainingAllowance',
  SPECIAL_ALLOWANCE: 'specialAllowance',
  PERFORMANCE_BONUS: 'performanceBonus',
  PF: 'providentFund',
  PROFESSIONAL_TAX: 'professionalTax',
  TDS: 'incomeTaxDeducted'
};

const TAX_SECTIONS = {
  SECTION_80C: 'section80C',
  SECTION_80CCD: 'section80CCD',
  SECTION_80D: 'section80D',
  SECTION_24: 'section24',
  SECTION_80G: 'section80G'
};

const USER_ROLES = {
  EMPLOYEE: 'employee',
  HR: 'hr',
  ADMIN: 'admin'
};

const PROOF_STATUS = {
  RECEIVED: 'RECEIVED',
  MISSING: 'MISSING',
  PENDING: 'PENDING'
};

module.exports = {
  HTTP_STATUS,
  ERROR_TYPES,
  SALARY_COMPONENTS,
  TAX_SECTIONS,
  USER_ROLES,
  PROOF_STATUS
};
