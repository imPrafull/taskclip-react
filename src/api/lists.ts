import { apiService } from "./api";
import { TaskListInfo } from "../models/task";

export type CreateListPayload = {
  name: string;
  description?: string;
  color: string;
};

export const createList = async (
  listData: CreateListPayload
): Promise<TaskListInfo> => {
  return apiService.apiFetch<TaskListInfo>("/lists", {
    method: "POST",
    body: JSON.stringify(listData),
  });
};

export const fetchLists = async (): Promise<TaskListInfo[]> => {
  return apiService.apiFetch<TaskListInfo[]>("/lists");
};

export const deleteList = async (id: string): Promise<void> => {
  await apiService.apiFetch<void>(`/lists/${id}`, {
    method: 'DELETE',
  });
};

export const updateList = async (id: string, data: { name?: string; description?: string; color?: string }): Promise<TaskListInfo> => {
  return apiService.apiFetch<TaskListInfo>(`/lists/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};
