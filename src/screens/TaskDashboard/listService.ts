import { apiService } from "../../lib/apiService";
import { TaskListInfo } from "../../models/task";

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