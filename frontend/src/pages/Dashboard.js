import React from 'react';
import UploadPayslip from '../components/UploadPayslip';
import PayrollQuery from '../components/PayrollQuery';
import TaxSimulation from '../components/TaxSimulation';
import InvestmentChecklist from '../components/InvestmentChecklist';

export default function Dashboard({ user }) {
  if (!user) return <p>Please login first.</p>;

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user.name}</h2>
      <p>Employee ID: {user.id}</p>

      <div className="section">
        <h3>📄 Payslip Upload</h3>
        <UploadPayslip userId={user.id} />
      </div>

      <div className="section">
        <h3>💰 Payroll Data</h3>
        <PayrollQuery userId={user.id} />
      </div>

      <div className="section">
        <h3>💡 Tax Saving Simulation</h3>
        <TaxSimulation />
      </div>

      <div className="section">
        <h3>📋 Investment Proof Checklist</h3>
        <InvestmentChecklist userId={user.id} />
      </div>
    </div>
  );
}
