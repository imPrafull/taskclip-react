import { TaskItem } from "../models/task";
import { apiService } from "./api";

type GetTasksParams = {
  limit?: number;
  skip?: number;
  sortBy?: string;
  completed?: boolean;
  listId?: string | null;
  due?: string | null;
  status?: string | null;
};

export async function getTasks(params: GetTasksParams): Promise<TaskItem[]> {
  const queryParams = new URLSearchParams();
  if (params.limit) {
    queryParams.append('limit', String(params.limit));
  }
  if (params.skip) {
    queryParams.append('skip', String(params.skip));
  }
  if (params.sortBy) {
    queryParams.append('sortBy', params.sortBy);
  }
  if (params.listId) {
    queryParams.append('listId', params.listId);
  }
  if (params.due && params.due !== 'all') {
    queryParams.append('due', params.due);
  }
  if (params.status && params.status !== 'all') {
    queryParams.append('status', params.status);
  }

  const queryString = queryParams.toString();
  const url = `/tasks${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiService.apiFetch<TaskItem[]>(url);
  return data;
}


export async function createTask(taskData: Partial<TaskItem>): Promise<TaskItem> {
  // Construct the payload as required by the backend.
  const body = {
    title: taskData.title,
    description: taskData.description,
    completed: false, // Default to false for new tasks
    dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
  };

  const newTask = await apiService.apiFetch<TaskItem>("/tasks", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return newTask;
}