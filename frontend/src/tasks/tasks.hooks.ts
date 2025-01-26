import { useState, useEffect } from "react";
import {
  fetchTasks,
  addOrUpdateTask,
  deleteTask,
  updateTaskOrder,
} from "./tasks.service";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "planned" | "in-progress" | "completed";
  order: number;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const data = await fetchTasks(token);
      setTasks(data);
    } catch (err) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateTask = async (
    task: Partial<Task>,
    taskId?: string
  ) => {
    try {
      const token = localStorage.getItem("token") || "";
      await addOrUpdateTask(token, task as Task, taskId);
      loadTasks();
    } catch {
      setError("Failed to add or update task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem("token") || "";
      await deleteTask(token, taskId);
      loadTasks();
    } catch {
      setError("Failed to delete task");
    }
  };

  const handleReorderTasks = async (updatedTasks: Task[]) => {
    try {
      const token = localStorage.getItem("token") || "";
      await updateTaskOrder(
        token,
        updatedTasks.map(({ id, order }) => ({ id, order }))
      );
      setTasks(updatedTasks);
    } catch {
      setError("Failed to update task order");
    }
  };

  return {
    tasks,
    loading,
    error,
    handleAddOrUpdateTask,
    handleDeleteTask,
    handleReorderTasks,
  };
};
