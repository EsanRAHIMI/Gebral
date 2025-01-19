import React, { useEffect, useState } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Task {
  id: number;
  title: string;
  description: string;
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string>('');

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found');
      const response = await fetch(`${BACKEND_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to fetch tasks');
      } else {
        setError('Failed to fetch tasks');
      }
    }
  };

  const addTask = async (e: React.FormEvent) => {
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
      if (!response.ok) throw new Error('Failed to add task');
      const newTask: Task = await response.json();
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError('Failed to add task');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Tasks</h1>
      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksPage;
