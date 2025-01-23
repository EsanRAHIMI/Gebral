import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskList } from "./tasks.components";
import { useTasks } from "./tasks.hooks";
import "./tasks.styles.css";
import { Task } from "./tasks.types";

const TasksPage: React.FC = () => {
  const {
    tasks,
    loading,
    error,
    handleAddOrUpdateTask,
    handleDeleteTask,
    handleReorderTasks,
  } = useTasks();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"planned" | "in-progress" | "completed">(
    "planned"
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setStatus(editingTask.status);
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddOrUpdateTask({ title, description, status }, editingTask?.id);
    setTitle("");
    setDescription("");
    setStatus("planned");
    setEditingTask(null);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex(
      (task) => task.id.toString() === active.id
    );
    const newIndex = tasks.findIndex((task) => task.id.toString() === over.id);
    const reorderedTasks = arrayMove(tasks, oldIndex, newIndex).map(
      (task, index) => ({
        ...task,
        order: index + 1,
      })
    );

    handleReorderTasks(reorderedTasks);
  };

  const sensors = useSensors(useSensor(PointerSensor));

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
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tasks.map((task) => task.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            <TaskList
              tasks={tasks}
              onDelete={(id) => {
                console.log("Deleting task with id:", id);
                handleDeleteTask(id);
              }}
              onEdit={(task) => {
                console.log("Editing task:", task);
                setEditingTask(task);
              }}
            />
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default TasksPage;
