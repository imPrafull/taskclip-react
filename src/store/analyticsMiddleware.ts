import type { Middleware } from '@reduxjs/toolkit';
import { posthog } from '../lib/posthog';
import { addNewTask, deleteTask, updateTask } from './slices/tasksSlice';

export const analyticsMiddleware: Middleware = () => (next) => (action: any) => {
  const result = next(action);

  if (addNewTask.fulfilled.match(action)) {
    posthog.capture('task_created', {
      task_id: action.payload?.id,
      title: action.payload?.title,
      status: action.payload?.status,
      has_due_date: !!action.payload?.dueDate,
      list_id: action.payload?.list ?? null,
    });
  }

  if (addNewTask.rejected.match(action)) {
    posthog.capture('task_create_failed', {
      error: action.error?.message,
    });
  }

  if (updateTask.fulfilled.match(action)) {
    posthog.capture('task_updated', {
      task_id: action.payload?.id,
      title: action.payload?.title,
      status: action.payload?.status,
    });
  }

  if (updateTask.rejected.match(action)) {
    posthog.capture('task_update_failed', {
      error: action.error?.message,
    });
  }

  if (deleteTask.fulfilled.match(action)) {
    posthog.capture('task_deleted', {
      task_id: action.payload,
    });
  }

  if (deleteTask.rejected.match(action)) {
    posthog.capture('task_delete_failed', {
      error: action.error?.message,
    });
  }

  return result;
};
