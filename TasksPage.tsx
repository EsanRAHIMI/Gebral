import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import './App.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Task {
  id: number;
  title: string;
  description: string;
  status: "planned" | "in-progress" | "completed";
  order: number;
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<"planned" | "in-progress" | "completed">("planned");
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
      setError("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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
        body: JSON.stringify({ title, description, status }),
      });

      if (!response.ok) throw new Error("Failed to add or update task");

      fetchTasks();
      setTitle("");
      setDescription("");
      setStatus("planned");
      setEditingTask(null);
    } catch {
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
    } catch {
      setError("Failed to delete task");
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setTasks((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === active.id);
      const newIndex = prev.findIndex((t) => t.id === over.id);
      const updatedTasks = arrayMove(prev, oldIndex, newIndex);

      const reorderedTasks = updatedTasks.map((task, index) => ({
        ...task,
        order: index + 1,
      }));

      updateTaskOrder(reorderedTasks);
      return reorderedTasks;
    });
  };

  const updateTaskOrder = async (updatedTasks: Task[]) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BACKEND_URL}/tasks/reorder`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTasks.map(({ id, order }) => ({ id, order }))),
      });
    } catch {
      setError("Failed to update task order");
    }
  };

  const groupedTasks = {
    planned: tasks.filter((task) => task.status === "planned"),
    inProgress: tasks.filter((task) => task.status === "in-progress"),
    completed: tasks.filter((task) => task.status === "completed"),
  };

  return (
    <div className="container">
      <h2 className="heading">Tasks</h2>
      <form onSubmit={addOrUpdateTask} className="task-form">
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
      </form>
      {error && <p className="error-message">{error}</p>}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {["planned", "inProgress", "completed"].map((statusKey) => (
          <div key={statusKey}>
            <h3 className="task-category">{statusKey.replace("-", " ")}</h3>
            <SortableContext items={groupedTasks[statusKey].map((task) => task.id)} strategy={verticalListSortingStrategy}>
              <ul className="task-list">
                {groupedTasks[statusKey].map((task) => (
                  <SortableTask
                    key={task.id}
                    task={task}
                    onDelete={() => deleteTask(task.id)}
                    onEdit={() => {
                      setEditingTask(task);
                      setTitle(task.title);
                      setDescription(task.description);
                      setStatus(task.status);
                    }}
                  />
                ))}
              </ul>
            </SortableContext>
          </div>
        ))}
      </DndContext>
    </div>
  );
};

const SortableTask = ({ task, onDelete, onEdit }: { task: Task; onDelete: () => void; onEdit: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners} className="task-item">
      <h3 className="task-title">{task.title}</h3>
      <p className="task-description">{task.description}</p>
      <div className="task-actions">
        <span className="edit-icon" onClick={onEdit}>✏️</span>
        <span className="delete-icon" onClick={onDelete}>🗑️</span>
      </div>
    </li>
  );
};

export default TasksPage;
