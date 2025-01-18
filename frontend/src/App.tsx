import React, { useState } from 'react';
import './App.css';
import {jwtDecode} from 'jwt-decode';
import { Link } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const result = await response.json();
      setToken(result.token);
      localStorage.setItem('token', result.token);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="app-container">
      <h1>Gebral AI</h1>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={() => console.log('Protected Data')} style={{ marginTop: '20px' }}>
        Fetch Protected Data
      </button>
      <Link to="/logs" style={{ display: 'block', marginTop: '20px', color: 'blue' }}>
        View Logs
      </Link>
      <Link to="/tasks" style={{ display: 'block', marginTop: '20px', color: 'blue' }}>
        Manage Tasks
      </Link>
      <Link to="/signup" style={{ display: 'block', marginTop: '20px', color: 'blue' }}>
        Sign Up
      </Link>
    </div>
  );
}

export default App;
