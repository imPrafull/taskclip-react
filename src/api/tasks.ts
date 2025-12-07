import { TaskItem } from "../models/task";
import { apiService } from "./api";

export async function fetchTasks(): Promise<TaskItem[]> {
  const data = await apiService.apiFetch<TaskItem[]>("/tasks?sortBy=createdAt:asc");
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