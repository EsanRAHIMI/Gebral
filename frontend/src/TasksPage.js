import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token)
                throw new Error('Token not found');
            const response = await fetch(`${BACKEND_URL}/tasks`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok)
                throw new Error('Failed to fetch tasks');
            const data = await response.json();
            setTasks(data);
        }
        catch (err) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message || 'Failed to fetch tasks');
            }
            else {
                setError('Failed to fetch tasks');
            }
        }
    };
    const addTask = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BACKEND_URL}/tasks`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description }),
            });
            if (!response.ok)
                throw new Error('Failed to add task');
            const newTask = await response.json();
            setTasks((prevTasks) => [...prevTasks, newTask]);
            setTitle('');
            setDescription('');
        }
        catch (err) {
            setError('Failed to add task');
        }
    };
    useEffect(() => {
        fetchTasks();
    }, []);
    return (_jsxs("div", { style: { padding: '20px' }, children: [_jsx("h1", { children: "Tasks" }), _jsxs("form", { onSubmit: addTask, children: [_jsx("input", { type: "text", placeholder: "Title", value: title, onChange: (e) => setTitle(e.target.value), required: true }), _jsx("textarea", { placeholder: "Description", value: description, onChange: (e) => setDescription(e.target.value) }), _jsx("button", { type: "submit", children: "Add Task" })] }), error && _jsx("p", { style: { color: 'red' }, children: error }), _jsx("ul", { children: tasks.map((task) => (_jsxs("li", { children: [_jsx("h3", { children: task.title }), _jsx("p", { children: task.description })] }, task.id))) })] }));
};
export default TasksPage;
