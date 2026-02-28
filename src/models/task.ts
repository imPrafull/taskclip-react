export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

export type Tag = {
  id: string;
  name: string;
  color: string;
  description?: string;
};

export type TaskListInfo = {
  id: string;
  name: string;
  color: string;
  count: number;
};

export enum TaskStatus {
  Todo = 'todo',
  InProgress = 'in progress',
  OnHold = 'on hold',
  Done = 'done',
}

// Tailwind text color classes for status option elements (no background colors)
export const statusOptionClassMap: Record<TaskStatus, string> = {
  [TaskStatus.Todo]: 'text-gray-500',
  [TaskStatus.InProgress]: 'text-blue-500',
  [TaskStatus.OnHold]: 'text-orange-500',
  [TaskStatus.Done]: 'text-green-500',
};

// Tailwind border color classes matching each status
export const statusBorderClassMap: Record<TaskStatus, string> = {
  [TaskStatus.Todo]: 'border-gray-400',
  [TaskStatus.InProgress]: 'border-blue-400',
  [TaskStatus.OnHold]: 'border-orange-400',
  [TaskStatus.Done]: 'border-green-400',
};

// Tailwind classes for a compact rounded badge for use in detail views
export const statusBadgeClassMap: Record<TaskStatus, string> = {
  [TaskStatus.Todo]: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  [TaskStatus.InProgress]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200',
  [TaskStatus.OnHold]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-200',
  [TaskStatus.Done]: 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200',
};

export type TaskItem = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  list?: TaskListInfo;
  subtasks?: Subtask[];
  tags?: Tag[];
  status: TaskStatus;
};

// Type for the payload when creating or updating a task
export type TaskPayload = {
  id?: string;
  title: string;
  description: string;
  list: string | null; // list ID
  dueDate: string;
  status?: TaskStatus;
  subtasks?: Subtask[];
};