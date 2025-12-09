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

export type TaskItem = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  list?: TaskListInfo;
  subtasks?: Subtask[];
  tags?: Tag[];
  completed: boolean;
};

// Type for the payload when creating or updating a task
export type TaskPayload = {
  id?: string;
  title: string;
  description: string;
  list: string | null; // list ID
  dueDate: string;
  subtasks?: Subtask[];
};