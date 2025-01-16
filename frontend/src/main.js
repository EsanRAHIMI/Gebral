import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import './index.css';
import LogsPage from './LogsPage'; // اضافه کردن صفحه لاگ‌ها
import TasksPage from './TasksPage';
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(App, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/signup", element: _jsx(Signup, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/logs", element: _jsx(LogsPage, {}) }), _jsx(Route, { path: "/tasks", element: _jsx(TasksPage, {}) })] }) }) }));
