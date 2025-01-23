import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import './App.css';
import App from './App';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import TasksPage from './Tasks-Page';
import CodeViewer from './CodeViewer';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/code" element={<CodeViewer />} />
      </Routes>
    </Router>
  </StrictMode>
);
