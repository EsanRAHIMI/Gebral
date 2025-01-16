import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(null);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const handleLogin = async (e) => {
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
                throw new Error('Login failed');
            }
            const result = await response.json();
            setToken(result.token);
            localStorage.setItem('token', result.token);
            setError(null);
        }
        catch (err) {
            setError(err.message);
        }
    };
    return (_jsxs("div", { className: "app-container", children: [_jsx("h1", { children: "Gebral AI" }), _jsxs("form", { onSubmit: handleLogin, className: "login-form", children: [_jsx("input", { type: "email", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), required: true }), _jsx("input", { type: "password", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value), required: true }), _jsx("button", { type: "submit", children: "Login" })] }), _jsx("button", { children: "Fetch Protected Data" }), _jsx(Link, { to: "/logs", style: { display: 'block', marginTop: '20px', color: 'blue' }, children: "View Logs" }), _jsx(Link, { to: "/tasks", style: { display: 'block', marginTop: '20px', color: 'blue' }, children: "Manage Tasks" }), _jsx(Link, { to: "/signup", style: { display: 'block', marginTop: '20px', color: 'blue' }, children: "Sign Up" })] }));
}
export default App;
