import React from 'react';
import UploadPayslip from '../components/UploadPayslip';
import PayrollQuery from '../components/PayrollQuery';
import TaxSimulation from '../components/TaxSimulation';
import InvestmentChecklist from '../components/InvestmentChecklist';

export default function Dashboard({ user, onLogout }) {
  if (!user) return <p>Please login first.</p>;

  return (
    <div className="dashboard-container">
      <div className="navbar">
        <div className="navbar-left">
          <h1>💰 Financial Wellness AI</h1>
        </div>
        <div className="navbar-right">
          <span className="user-info">👤 {user.name}</span>
          <button className="logout-btn" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome, {user.name}</h2>
          <p>Employee ID: <strong>{user.id}</strong> | Email: <strong>{user.email}</strong></p>
        </div>

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

      <style>{`
        .dashboard-container {
          min-height: 100vh;
          background-color: #f5f5f5;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .navbar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .navbar-left h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .user-info {
          font-size: 14px;
          font-weight: 500;
        }

        .logout-btn {
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid white;
          padding: 8px 16px;
          border-radius: 5px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .logout-btn:hover {
          background-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px 20px;
        }

        .welcome-section {
          background: white;
          padding: 25px;
          border-radius: 10px;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .welcome-section h2 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 28px;
        }

        .welcome-section p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .section {
          background: white;
          padding: 25px;
          border-radius: 10px;
          margin-bottom: 25px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .section h3 {
          margin: 0 0 20px 0;
          color: #333;
          font-size: 20px;
          border-bottom: 3px solid #667eea;
          padding-bottom: 10px;
        }

        @media (max-width: 768px) {
          .navbar {
            flex-direction: column;
            gap: 15px;
            padding: 15px;
          }

          .navbar-left h1 {
            font-size: 20px;
          }

          .navbar-right {
            width: 100%;
            justify-content: space-between;
          }

          .dashboard-content {
            padding: 15px;
          }

          .welcome-section {
            padding: 15px;
          }

          .section {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
}
