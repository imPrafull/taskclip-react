export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

export type Tag = {
  id: string;
  name: string;
  color: string;
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
  listId?: string;
  listName?: string;
  listColor?: string;
  subtasks?: Subtask[];
  tags?: Tag[];
  completed: boolean;
};