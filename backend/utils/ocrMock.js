/**
 * Enhanced OCR Mock with realistic payslip data
 * Includes all required fields: deductions, reimbursements, YTD values, dates
 */

function parsePayslip(base64, mockPayslipVersion = 1) {
  // Mock OCR extraction - returns standardized payslip object
  // In production, would use actual OCR/PDF parsing library
  
  const payslips = {
    1: {
      month: 'June',
      year: 2024,
      payPeriod: '2024-06-01 to 2024-06-30',
      employeeId: 'u001',
      employeeName: 'Ayushya Sharma',
      designation: 'Senior Software Engineer',
      
      // Earnings
      earnings: {
        basicSalary: 30000,
        houseRentAllowance: 15000,
        learningTrainingAllowance: 5000,
        specialAllowance: 5000,
        performanceBonus: 2000,
        grossEarnings: 57000
      },
      
      // Deductions
      deductions: {
        providentFund: 3600,
        professionalTax: 200,
        incomeTaxDeducted: 6400,
        medicineReimbursement: 1200,
        totalDeductions: 11400
      },
      
      // Reimbursements
      reimbursements: {
        conveyance: 800,
        mobile: 500,
        medicineExpense: 1200,
        travelExpense: 2500,
        totalReimbursements: 5000
      },
      
      // Summary
      summary: {
        grossSalary: 57000,
        totalDeductions: 11400,
        netSalary: 50600,
      },
      
      // Year-to-date
      ytd: {
        grossSalary: 342000,
        deductions: 68400,
        netSalary: 303600,
        providentFundContribution: 21600
      },
      
      // Tax declaration info
      taxDeclaration: {
        section80C: {
          epf: 21600,
          lic: 15000,
          ppf: 30000,
          total: 66600,
          limit: 150000
        },
        section80CCD: {
          nps: 20000
        },
        section80D: {
          selfMedical: 15000,
          parentMedical: 10000,
          total: 25000
        },
        section24: {
          homeInterest: 40000
        }
      }
    },
    2: {
      month: 'June',
      year: 2024,
      payPeriod: '2024-06-01 to 2024-06-30',
      employeeId: 'u002',
      employeeName: 'Ravi Kumar',
      designation: 'Business Analyst',
      
      earnings: {
        basicSalary: 28000,
        houseRentAllowance: 12000,
        learningTrainingAllowance: 4000,
        specialAllowance: 3000,
        performanceBonus: 1500,
        grossEarnings: 48500
      },
      
      deductions: {
        providentFund: 3360,
        professionalTax: 200,
        incomeTaxDeducted: 5200,
        medicineReimbursement: 800,
        totalDeductions: 9560
      },
      
      reimbursements: {
        conveyance: 600,
        mobile: 400,
        medicineExpense: 800,
        travelExpense: 1800,
        totalReimbursements: 3600
      },
      
      summary: {
        grossSalary: 48500,
        totalDeductions: 9560,
        netSalary: 41940
      },
      
      ytd: {
        grossSalary: 291000,
        deductions: 57360,
        netSalary: 251640,
        providentFundContribution: 20160
      },
      
      taxDeclaration: {
        section80C: {
          epf: 20160,
          lic: 12000,
          ppf: 25000,
          total: 57160,
          limit: 150000
        },
        section80CCD: {
          nps: 15000
        },
        section80D: {
          selfMedical: 12000,
          parentMedical: 8000,
          total: 20000
        },
        section24: {
          homeInterest: 35000
        }
      }
    }
  };
  
  // Return default or specified version
  return payslips[mockPayslipVersion] || payslips[1];
}

/**
 * Extract specific components from parsed payslip
 */
function getPayslipSummary(payslipData) {
  return {
    month: payslipData.month,
    year: payslipData.year,
    employee: payslipData.employeeName,
    basicSalary: payslipData.earnings.basicSalary,
    gross: payslipData.summary.grossSalary,
    deductions: payslipData.summary.totalDeductions,
    net: payslipData.summary.netSalary,
    ytdGross: payslipData.ytd.grossSalary,
    ytdNet: payslipData.ytd.netSalary
  };
}

/**
 * Format payslip for display
 */
function formatPayslipForDisplay(payslipData) {
  return `
═══════════════════════════════════════════════════════════════
PAYSLIP - ${payslipData.month.toUpperCase()} ${payslipData.year}
═══════════════════════════════════════════════════════════════
Employee: ${payslipData.employeeName} (${payslipData.employeeId})
Designation: ${payslipData.designation}
Pay Period: ${payslipData.payPeriod}

───────────────────────────────────────────────────────────────
EARNINGS
───────────────────────────────────────────────────────────────
Basic Salary:              ₹${payslipData.earnings.basicSalary.toLocaleString()}
House Rent Allowance:      ₹${payslipData.earnings.houseRentAllowance.toLocaleString()}
Learning/Training Allow.:  ₹${payslipData.earnings.learningTrainingAllowance.toLocaleString()}
Special Allowance:         ₹${payslipData.earnings.specialAllowance.toLocaleString()}
Performance Bonus:         ₹${payslipData.earnings.performanceBonus.toLocaleString()}
───────────────────────────────────────────────────────────────
Gross Earnings:            ₹${payslipData.summary.grossSalary.toLocaleString()}

───────────────────────────────────────────────────────────────
DEDUCTIONS
───────────────────────────────────────────────────────────────
Provident Fund:            ₹${payslipData.deductions.providentFund.toLocaleString()}
Professional Tax:          ₹${payslipData.deductions.professionalTax.toLocaleString()}
Income Tax (TDS):          ₹${payslipData.deductions.incomeTaxDeducted.toLocaleString()}
───────────────────────────────────────────────────────────────
Total Deductions:          ₹${payslipData.summary.totalDeductions.toLocaleString()}

───────────────────────────────────────────────────────────────
REIMBURSEMENTS
───────────────────────────────────────────────────────────────
Conveyance:                ₹${payslipData.reimbursements.conveyance.toLocaleString()}
Mobile Allowance:          ₹${payslipData.reimbursements.mobile.toLocaleString()}
Medical Reimbursement:     ₹${payslipData.reimbursements.medicineExpense.toLocaleString()}
Travel Reimbursement:      ₹${payslipData.reimbursements.travelExpense.toLocaleString()}
───────────────────────────────────────────────────────────────
Total Reimbursements:      ₹${payslipData.summary.netSalary.toLocaleString()}

═══════════════════════════════════════════════════════════════
NET SALARY (In Hand):      ₹${payslipData.summary.netSalary.toLocaleString()}
═══════════════════════════════════════════════════════════════

YEAR-TO-DATE SUMMARY
Gross (6 months):          ₹${payslipData.ytd.grossSalary.toLocaleString()}
Deductions (6 months):     ₹${payslipData.ytd.deductions.toLocaleString()}
Net (6 months):            ₹${payslipData.ytd.netSalary.toLocaleString()}
===════════════════════════════════════════════════════════════
  `;
}

module.exports = { parsePayslip, getPayslipSummary, formatPayslipForDisplay };

