import React, { useEffect, useState } from "react";
import './App.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Task {
  id: number;
  title: string;
  description: string;
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState<string>("");

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");
      const response = await fetch(`${BACKEND_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tasks");
    }
  };

  const addOrUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = editingTask
        ? `${BACKEND_URL}/tasks/${editingTask.id}`
        : `${BACKEND_URL}/tasks`;
      const method = editingTask ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) throw new Error("Failed to add or update task");

      const updatedTask: Task = await response.json();
      setTasks((prevTasks) =>
        editingTask
          ? prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
          : [updatedTask, ...prevTasks]
      );
      setTitle("");
      setDescription("");
      setEditingTask(null);
    } catch (err) {
      setError("Failed to add or update task");
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete task");

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container">
      <h2>Tasks</h2>
      <form onSubmit={addOrUpdateTask}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
          />
        </div>
        <button type="submit" className="btn-primary">
          {editingTask ? "Update Task" : "Add Task"}
        </button>
        {editingTask && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setEditingTask(null);
              setTitle("");
              setDescription("");
            }}
          >
            Cancel
          </button>
        )}
      </form>
      {error && <p className="error">{error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-content">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </div>
            <div className="task-actions">
              <span
                className="edit-icon"
                onClick={() => {
                  setEditingTask(task);
                  setTitle(task.title);
                  setDescription(task.description);
                }}
              >
                ✏️
              </span>
              <span
                className="delete-icon"
                onClick={() => deleteTask(task.id)}
              >
                🗑️
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksPage;
