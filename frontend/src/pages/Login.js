import React, { useState } from 'react';
import api from '../services/api';

export default function Login({ setUser }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!userId || !password) {
      setError('Please enter both user ID and password');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const res = await api.post('/auth/login', { userId, password });
      
      // Store token for subsequent requests
      localStorage.setItem('authToken', res.data.token);
      setUser(res.data.user);
      alert(`Welcome ${res.data.user.name}`);
    } catch (err) {
      const message = err.response?.data?.error || "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Financial Wellness AI</h1>
        <h2>Employee Portal</h2>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="userId">User ID:</label>
            <input
              id="userId"
              type="text"
              placeholder="Enter User ID (u001 or u002)"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="demo-info">
          <p><strong>Demo Credentials:</strong></p>
          <ul>
            <li>User ID: <code>u001</code></li>
            <li>Password: <code>password123</code></li>
          </ul>
          <ul>
            <li>User ID: <code>u002</code></li>
            <li>Password: <code>password123</code></li>
          </ul>
        </div>
      </div>

      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .login-box {
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          width: 100%;
          max-width: 400px;
        }

        .login-box h1 {
          color: #333;
          text-align: center;
          margin: 0 0 5px 0;
          font-size: 28px;
        }

        .login-box h2 {
          color: #667eea;
          text-align: center;
          margin: 0 0 30px 0;
          font-size: 18px;
          font-weight: 500;
        }

        form {
          display: flex;
          flex-direction: column;
        }

        .form-group {
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        .form-group input {
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 5px;
          font-size: 14px;
          transition: border-color 0.3s;
          font-family: inherit;
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group input:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }

        .error-message {
          color: #dc3545;
          font-size: 14px;
          margin: 10px 0;
          padding: 10px;
          background-color: #f8d7da;
          border-left: 4px solid #dc3545;
          border-radius: 3px;
        }

        .login-btn {
          padding: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          margin-top: 10px;
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .demo-info {
          margin-top: 30px;
          padding: 15px;
          background-color: #f0f8ff;
          border-left: 4px solid #667eea;
          border-radius: 5px;
          font-size: 13px;
        }

        .demo-info p {
          margin: 0 0 10px 0;
          color: #333;
          font-weight: 600;
        }

        .demo-info ul {
          margin: 10px 0;
          padding-left: 20px;
        }

        .demo-info li {
          margin: 5px 0;
          color: #555;
        }

        .demo-info code {
          background-color: #e0e0e0;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          color: #333;
        }
      `}</style>
    </div>
  );
}
