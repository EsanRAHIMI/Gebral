import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "./tasks.types";

interface TaskItemProps {
  task: Task;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id.toString() });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // جلوگیری از تداخل درگ و کلیک دکمه‌ها
  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    action: "edit" | "delete"
  ) => {
    e.stopPropagation(); // جلوگیری از تداخل کلیک با درگ
    e.preventDefault();
    if (action === "edit") {
      onEdit(task);
    } else if (action === "delete") {
      onDelete(task.id);
    }
  };

  return (
    <li ref={setNodeRef} style={style} className={`task-item ${task.status}`}>
      <div {...listeners} {...attributes} className="task-content">
        <h3 className="task-title">{task.title}</h3>
        <p className="task-description">{task.description}</p>
      </div>
      <div className="task-actions">
        <button
          className="btn-icon"
          onClick={(e) => handleButtonClick(e, "edit")}
        >
          ✏️
        </button>
        <button
          className="btn-icon"
          onClick={(e) => handleButtonClick(e, "delete")}
        >
          🗑️
        </button>
      </div>
    </li>
  );
};

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, onEdit }) => {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </ul>
  );
};
