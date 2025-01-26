const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchTasks = async (token: string) => {
  const response = await fetch(`${BACKEND_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch tasks");
  return response.json();
};

export const addOrUpdateTask = async (
  token: string,
  task: { title: string; description: string; status: string },
  taskId?: string // شناسه تغییر داده شده
) => {
  const url = taskId ? `${BACKEND_URL}/tasks/${taskId}` : `${BACKEND_URL}/tasks/`;
  const method = taskId ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) throw new Error("Failed to add or update task");
  return response.json();
};

export const deleteTask = async (token: string, taskId: string) => {
  const response = await fetch(`${BACKEND_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to delete task");
};

export const updateTaskOrder = async (
  token: string,
  updatedTasks: { id: string; order: number }[]
) => {
  await fetch(`${BACKEND_URL}/tasks/reorder`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTasks),
  });
};
