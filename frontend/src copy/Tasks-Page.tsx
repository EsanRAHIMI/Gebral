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
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskItem from "./Task-Item";
import { fetchTasks, addOrUpdateTask, deleteTask, updateTaskOrder, Task } from "./Task-api";
import "./App.css";

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<"planned" | "in-progress" | "completed">("planned");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchTasks(setTasks, setError);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOrUpdateTask(
      { title, description, status },
      editingTask,
      setTasks,
      setError,
      () => {
        setTitle("");
        setDescription("");
        setStatus("planned");
        setEditingTask(null);
      }
    );
  };

  const handleDelete = async (taskId: number) => {
    await deleteTask(taskId, setTasks, setError);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setTasks((prevTasks) => {
      const oldIndex = prevTasks.findIndex((task) => task.id === active.id);
      const newIndex = prevTasks.findIndex((task) => task.id === over.id);
      const reorderedTasks = arrayMove(prevTasks, oldIndex, newIndex).map((task, index) => ({
        ...task,
        order: index + 1,
      }));

      updateTaskOrder(reorderedTasks, setError);
      return reorderedTasks;
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="container">
      <h2 className="heading">Tasks</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="btn-primary">
          {editingTask ? "Update Task" : "Add Task"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          <ul className="task-list">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} onDelete={() => handleDelete(task.id)} onEdit={() => handleEdit(task)} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default TasksPage;
