import { apiService } from "./api";
import { Tag } from "../models/task";

export type CreateTagPayload = {
  name: string;
  color: string;
  description?: string;
};

export const createTag = async (
  tagData: CreateTagPayload
): Promise<Tag> => {
  return apiService.apiFetch<Tag>("/tags", {
    method: "POST",
    body: JSON.stringify(tagData),
  });
};

export const fetchTags = async (): Promise<Tag[]> => {
  return apiService.apiFetch<Tag[]>("/tags");
};
