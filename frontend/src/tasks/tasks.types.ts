export interface Task {
  id: string;
  title: string;
  description: string;
  status: "planned" | "in-progress" | "completed";
  order: number;
}

export interface TaskFormProps {
  initialValues?: Partial<Task>;
  onSubmit: (task: Partial<Task>) => void;
}

export interface TaskItemProps {
  task: Task;
  onDelete: () => void;
  onEdit: () => void;
}

export interface TaskListProps {
  tasks: Task[];
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}
