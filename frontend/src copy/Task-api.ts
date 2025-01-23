const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface Task {
  id: number;
  title: string;
  description: string;
  status: "planned" | "in-progress" | "completed";
  order: number;
}

export const fetchTasks = async (setTasks: (tasks: Task[]) => void, setError: (error: string) => void) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const response = await fetch(`${BACKEND_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch tasks");

    const data: Task[] = await response.json();
    setTasks(data);
  } catch {
    setError("Failed to fetch tasks");
  }
};

export const addOrUpdateTask = async (
  task: Partial<Task>,
  editingTask: Task | null,
  setTasks: (tasks: Task[]) => void,
  setError: (error: string) => void,
  resetForm: () => void
) => {
  try {
    const token = localStorage.getItem("token");
    const url = editingTask ? `${BACKEND_URL}/tasks/${editingTask.id}` : `${BACKEND_URL}/tasks`;
    const method = editingTask ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) throw new Error("Failed to add or update task");

    fetchTasks(setTasks, setError);
    resetForm();
  } catch {
    setError("Failed to add or update task");
  }
};

export const deleteTask = async (
  taskId: number,
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  setError: (error: string) => void
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to delete task");

    setTasks((prevTasks) => [...prevTasks.filter((task) => task.id !== taskId)]);
  } catch {
    setError("Failed to delete task");
  }
};

export const updateTaskOrder = async (updatedTasks: Task[], setError: (error: string) => void) => {
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
