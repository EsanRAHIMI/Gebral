import { Task } from "./tasks.types";

export const filterTasksByStatus = (tasks: Task[], status: "planned" | "in-progress" | "completed") => {
  return tasks.filter((task) => task.status === status);
};

export const sortTasksByOrder = (tasks: Task[]) => {
  return [...tasks].sort((a, b) => a.order - b.order);
};

export const formatTaskTitle = (title: string) => {
  return title.length > 20 ? title.substring(0, 20) + "..." : title;
};

export const generateTaskId = () => {
  return Math.floor(Math.random() * 1000000);
};

export const mapTaskStatusToLabel = (status: "planned" | "in-progress" | "completed") => {
  const statusMap = {
    planned: "Planned",
    "in-progress": "In Progress",
    completed: "Completed",
  };
  return statusMap[status];
};
