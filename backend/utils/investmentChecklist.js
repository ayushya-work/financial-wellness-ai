/**
 * Investment Proof Checklist Generator
 * Generates required documents based on employee's declared deductions
 */

const PROOF_REQUIREMENTS = {
  section80C: {
    title: 'Section 80C - Savings (Max ₹150,000)',
    items: {
      epf: {
        description: 'Provident Fund Contribution',
        requiredProofs: ['Form 16 / Payslip (EPF details)', 'Bank statement showing EPF transfer'],
        deadline: 'Before ITR filing'
      },
      lic: {
        description: 'Life Insurance Premium',
        requiredProofs: ['Insurance policy document', 'Premium receipt/payment proof', 'Annual statement from insurer'],
        deadline: 'Before ITR filing'
      },
      ppf: {
        description: 'Public Provident Fund',
        requiredProofs: ['PPF passbook / account statement', 'Deposit receipts for current year'],
        deadline: 'Before ITR filing'
      },
      fd: {
        description: 'Fixed Deposit (5-year)',
        requiredProofs: ['FD receipt', 'FD statement showing 5-year tenure'],
        deadline: 'Before ITR filing'
      },
      ulip: {
        description: 'ULIP (Unit Linked Insurance Plan)',
        requiredProofs: ['Policy document', 'Premium payment receipts', 'Annual statement'],
        deadline: 'Before ITR filing'
      },
      nsc: {
        description: 'National Savings Certificate',
        requiredProofs: ['NSC certificate', 'Receipt/proof of investment'],
        deadline: 'Before ITR filing'
      },
      savings: {
        description: 'Savings Account Interest',
        requiredProofs: ['Bank passbook / statement showing interest earned', 'Interest certificate from bank'],
        deadline: 'Before ITR filing'
      }
    }
  },
  section80CCD: {
    title: 'Section 80CCD - NPS (Max ₹50,000)',
    items: {
      nps: {
        description: 'National Pension Scheme Contribution',
        requiredProofs: ['NPS statement showing contributions', 'Contribution receipts', 'Bank statements'],
        deadline: 'Before ITR filing'
      }
    }
  },
  section80D: {
    title: 'Section 80D - Medical Insurance (Max ₹150,000)',
    items: {
      selfMedical: {
        description: 'Self Medical Insurance Premium',
        requiredProofs: ['Insurance policy', 'Premium payment receipt', 'Annual statement'],
        deadline: 'Before ITR filing'
      },
      parentMedical: {
        description: 'Parent Medical Insurance Premium',
        requiredProofs: ['Insurance policy', 'Premium payment receipt', 'Proof of parent relationship'],
        deadline: 'Before ITR filing'
      },
      medical: {
        description: 'Medical Treatment Expenses',
        requiredProofs: ['Hospital bills/receipts', 'Doctor prescription', 'Payment proof'],
        deadline: 'During ITR filing'
      }
    }
  },
  section24: {
    title: 'Section 24 - Home Loan Interest',
    items: {
      homeInterest: {
        description: 'Home Loan Interest',
        requiredProofs: ['Home loan statement from bank', 'Interest certificate (Form 16A if applicable)', 'Property registration'],
        deadline: 'Before ITR filing'
      }
    }
  },
  section80G: {
    title: 'Section 80G - Charitable Donations',
    items: {
      donation: {
        description: 'Donation to Charitable Organization',
        requiredProofs: ['NGO registration certificate (80G)', 'Donation receipt', 'Payment proof'],
        deadline: 'Before ITR filing'
      }
    }
  }
};

/**
 * Generate checklist for employee based on tax declaration
 * @param {Object} taxDeclaration - Employee's declared deductions
 * @param {Object} investmentProofs - Proof status for each investment
 * @returns {Object} Organized checklist with missing/received items
 */
function generateInvestmentChecklist(taxDeclaration, investmentProofs = {}) {
  const checklist = {
    generatedAt: new Date().toISOString(),
    totalItems: 0,
    missingCount: 0,
    receivedCount: 0,
    sections: {}
  };

  // Process each tax section
  Object.keys(taxDeclaration).forEach(sectionKey => {
    const sectionData = taxDeclaration[sectionKey];
    
    if (!sectionData || typeof sectionData !== 'object') return;

    const section = PROOF_REQUIREMENTS[sectionKey];
    if (!section) return;

    checklist.sections[sectionKey] = {
      title: section.title,
      items: []
    };

    // Process each item in the section
    Object.keys(sectionData).forEach(itemKey => {
      if (itemKey === 'total' || itemKey === 'limit') return; // Skip totals

      const amount = sectionData[itemKey];
      if (amount <= 0) return; // Skip items with no amount

      const itemSpec = section.items[itemKey];
      if (!itemSpec) return;

      const proofStatus = investmentProofs[`${sectionKey}_${itemKey}`];
      const hasProof = proofStatus && proofStatus.received === true;

      checklist.sections[sectionKey].items.push({
        key: itemKey,
        description: itemSpec.description,
        amount: amount,
        requiredProofs: itemSpec.requiredProofs,
        status: hasProof ? 'RECEIVED' : 'MISSING',
        deadline: itemSpec.deadline,
        receiptDate: hasProof ? proofStatus.receiptDate : null,
        notes: hasProof ? proofStatus.notes : 'Please submit required documents'
      });

      checklist.totalItems++;
      if (hasProof) {
        checklist.receivedCount++;
      } else {
        checklist.missingCount++;
      }
    });
  });

  return checklist;
}

/**
 * Generate human-readable checklist report
 */
function formatChecklistReport(checklist) {
  let report = `
╔════════════════════════════════════════════════════════════════════╗
║           TAX INVESTMENT PROOF CHECKLIST                           ║
║  Generated: ${new Date(checklist.generatedAt).toLocaleDateString()}                                      ║
╚════════════════════════════════════════════════════════════════════╝

SUMMARY:
  Total Items:        ${checklist.totalItems}
  Received:           ✓ ${checklist.receivedCount}
  Missing:            ✗ ${checklist.missingCount}
  Completion:         ${Math.round((checklist.receivedCount / checklist.totalItems) * 100)}%

────────────────────────────────────────────────────────────────────

`;

  Object.keys(checklist.sections).forEach(sectionKey => {
    const section = checklist.sections[sectionKey];
    if (section.items.length === 0) return;

    report += `\n${section.title}\n`;
    report += `${'─'.repeat(70)}\n`;

    section.items.forEach(item => {
      const statusIcon = item.status === 'RECEIVED' ? '✓' : '✗';
      const statusColor = item.status === 'RECEIVED' ? 'green' : 'red';

      report += `\n[${statusIcon}] ${item.description}\n`;
      report += `    Amount: ₹${item.amount.toLocaleString()}\n`;
      report += `    Required Proofs:\n`;
      item.requiredProofs.forEach(proof => {
        report += `      • ${proof}\n`;
      });
      report += `    Status: ${item.status}\n`;
      report += `    Deadline: ${item.deadline}\n`;

      if (item.notes) {
        report += `    Note: ${item.notes}\n`;
      }
    });

    report += '\n';
  });

  report += `\n════════════════════════════════════════════════════════════════════\n`;
  report += `For detailed tax planning, consult with a qualified CA/tax professional.\n`;
  report += `════════════════════════════════════════════════════════════════════\n`;

  return report;
}

module.exports = {
  PROOF_REQUIREMENTS,
  generateInvestmentChecklist,
  formatChecklistReport
};
