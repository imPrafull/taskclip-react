import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TaskItem, TaskPayload, TaskStatus } from '../../models/task';
import { MutableRefObject } from 'react';
import { getTasks as getTasksApi, getTaskById as getTaskByIdApi } from '../../api/tasks';
import { apiService } from '../../api/api';

interface TasksState {
  tasks: TaskItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  page: number;
  hasMore: boolean;
}

const initialState: TasksState = {
  tasks: [],
  status: 'idle',
  error: null,
  page: 1,
  hasMore: true,
};

interface GetTasksParams {
  page: number;
  sort?: string;
  loadingRef?: MutableRefObject<boolean>;
  listId?: string | null;
  due?: string | null;
  status?: string | null;
}
export const getTasks = createAsyncThunk('tasks/getTasks', async ({ page, sort, loadingRef, listId, due, status }: GetTasksParams, { getState }) => {
  try {
    const state = getState() as any;
    const sortByValue = sort ?? state.taskfilters.sortBy;
    const limit = 30;
    const skip = (page - 1) * limit;
    // Prefer explicit listId/due params, otherwise fall back to currently selected values in filters
    const effectiveListId = listId ?? state.taskfilters.selectedListId ?? null;
    const effectiveDue = due ?? state.taskfilters.selectedTaskNavItemId ?? null;
    const effectiveStatus = status ?? state.taskfilters.selectedStatus ?? null;
    const apiParams: any = { limit, skip, sortBy: sortByValue };
    if (effectiveListId) apiParams.listId = effectiveListId;
    if (effectiveDue && effectiveDue !== 'all') apiParams.due = effectiveDue;
    if (effectiveStatus && effectiveStatus !== 'all') apiParams.status = effectiveStatus;
    const response = await getTasksApi(apiParams);
    return { tasks: response, page };
  } finally {
    if (loadingRef) loadingRef.current = false;
  }
});

export const fetchTaskById = createAsyncThunk('tasks/fetchTaskById', async (taskId: string) => {
  return getTaskByIdApi(taskId);
});

export const addNewTask = createAsyncThunk('tasks/addNewTask', async (newTask: Omit<TaskPayload, 'id'> & { status?: TaskStatus }) => {
  const payload = { ...newTask, status: newTask.status ?? TaskStatus.Todo };
  const response = await apiService.apiFetch<TaskItem>('/tasks', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId: string) => {
  await apiService.apiFetch(`/tasks/${taskId}`, {
    method: 'DELETE',
  });
  // Return the id to identify which task to remove in the reducer.
  return taskId;
});

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (taskUpdate: Partial<TaskPayload> & { id: string }) => {
    // Destructure to separate the ID and remove fields that should not be sent in the PATCH body.
    // The backend likely manages these fields automatically.
    const {
      id,
      _id,
      __v,
      createdAt,
      updatedAt,
      owner,
      subtasks,
      ...taskData
    } = taskUpdate as any;
    const response = await apiService.apiFetch<TaskItem>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(taskData),
    });
    return response;
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    resetTasks: (state) => {
      state.tasks = [];
      state.page = 1;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getTasks.fulfilled, (state, action: PayloadAction<{ tasks: TaskItem[], page: number }>) => {
        state.status = 'succeeded';
        if (action.payload.page === 1) {
          state.tasks = action.payload.tasks;
        } else {
          state.tasks = [...state.tasks, ...action.payload.tasks];
        }
        state.hasMore = action.payload.tasks.length > 0;
        state.page = action.payload.page + 1;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(addNewTask.fulfilled, (state, action: PayloadAction<TaskItem>) => {
        state.tasks.push(action.payload);
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<TaskItem>) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(fetchTaskById.fulfilled, (state, action: PayloadAction<TaskItem>) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        } else {
          state.tasks.push(action.payload);
        }
      });
  },
});

export const {
  resetTasks,
} = tasksSlice.actions;
export default tasksSlice.reducer;
