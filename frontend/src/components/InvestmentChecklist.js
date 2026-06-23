import React, { useState } from 'react';
import api from '../services/api';

export default function InvestmentChecklist({ userId, showTitle = true }) {
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchChecklist = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/checklist/${userId}`);
      setChecklist(res.data);
    } catch (err) {
      const message = err.response?.data?.error || "Failed to fetch checklist";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    return status === 'RECEIVED' 
      ? '✓ RECEIVED' 
      : '✗ MISSING';
  };

  return (
    <div className="checklist-container">
      {showTitle && <h3>Investment Proof Checklist</h3>}
      <button onClick={fetchChecklist} disabled={loading}>
        {loading ? 'Loading...' : 'View Checklist'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {checklist && (
        <div className="checklist-content">
          <div className="checklist-summary">
            <p>
              <strong>Progress:</strong> {checklist.receivedCount} / {checklist.totalItems} 
              ({Math.round((checklist.receivedCount / checklist.totalItems) * 100)}% complete)
            </p>
          </div>

          <div className="checklist-sections">
            {Object.entries(checklist.sections).map(([sectionKey, section]) => (
              <div key={sectionKey} className="section">
                <h4>{section.title}</h4>
                {section.items.length === 0 ? (
                  <p>No items in this section</p>
                ) : (
                  <ul>
                    {section.items.map((item) => (
                      <li key={item.key} className={`item ${item.status.toLowerCase()}`}>
                        <div className="item-header">
                          <strong>{item.description}</strong>
                          <span className={`badge ${item.status.toLowerCase()}`}>
                            {getStatusBadge(item.status)}
                          </span>
                        </div>
                        <p className="amount">Amount: ₹{item.amount.toLocaleString()}</p>
                        <p className="deadline">Deadline: {item.deadline}</p>
                        <div className="proofs">
                          <strong>Required Proofs:</strong>
                          <ul>
                            {item.requiredProofs.map((proof, idx) => (
                              <li key={idx}>{proof}</li>
                            ))}
                          </ul>
                        </div>
                        {item.notes && <p className="notes">Note: {item.notes}</p>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="checklist-footer">
            <p>
              For detailed tax planning, consult with a qualified Chartered Accountant or tax professional.
            </p>
          </div>
        </div>
      )}

      <style>{`
        .checklist-container {
          margin: 20px 0;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        .checklist-summary {
          background-color: #f0f0f0;
          padding: 15px;
          border-radius: 5px;
          margin: 15px 0;
        }

        .checklist-sections {
          margin: 20px 0;
        }

        .section {
          margin: 20px 0;
          padding: 15px;
          border-left: 4px solid #007bff;
          background-color: #f9f9f9;
        }

        .section h4 {
          margin-top: 0;
          color: #333;
        }

        .item {
          list-style: none;
          padding: 15px;
          margin: 10px 0;
          background-color: white;
          border: 1px solid #ddd;
          border-radius: 5px;
        }

        .item.received {
          border-left: 4px solid #28a745;
        }

        .item.missing {
          border-left: 4px solid #dc3545;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .badge {
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }

        .badge.received {
          background-color: #d4edda;
          color: #155724;
        }

        .badge.missing {
          background-color: #f8d7da;
          color: #721c24;
        }

        .amount, .deadline {
          margin: 5px 0;
          font-size: 14px;
          color: #666;
        }

        .proofs {
          margin: 10px 0;
        }

        .proofs ul {
          margin: 5px 0 0 20px;
          padding-left: 0;
        }

        .proofs li {
          margin: 5px 0;
          font-size: 14px;
        }

        .notes {
          margin-top: 10px;
          padding: 10px;
          background-color: #fff3cd;
          border-left: 3px solid #ffc107;
          font-size: 14px;
        }

        .checklist-footer {
          margin-top: 20px;
          padding: 15px;
          background-color: #e7f3ff;
          border-radius: 5px;
          font-size: 14px;
          color: #0066cc;
        }
      `}</style>
    </div>
  );
}
