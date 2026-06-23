import React, { useState } from 'react';
import api from '../services/api';

export default function PayrollQuery({ userId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPayroll = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/payroll/${userId}`);
      setData(res.data);
    } catch (err) {
      const message = err.response?.data?.error || "Failed to fetch payroll data";
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchPayroll} disabled={loading}>
        {loading ? 'Loading...' : 'Get Payroll Data'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && (
        <div>
          <h4>Payroll Breakdown</h4>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
