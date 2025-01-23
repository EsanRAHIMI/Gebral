import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="container">
      <h1>Welcome, {user.name || 'Guest'}</h1>
      <p>ID: {user.id || 'N/A'}</p>
      <Link to="/tasks">
        <button className="btn-primary">Manage Your Tasks</button>
      </Link>
      <button onClick={handleLogout} className="btn-secondary">Logout</button>
    </div>
  );
};

export default Dashboard;
