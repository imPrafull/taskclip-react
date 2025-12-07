import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TaskItem, TaskPayload } from '../../models/task';
import { apiService } from '../../api/api';

interface TasksState {
  tasks: TaskItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  status: 'idle',
  error: null,
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await apiService.apiFetch<TaskItem[]>('/tasks');
  return response;
});

export const addNewTask = createAsyncThunk('tasks/addNewTask', async (newTask: Omit<TaskPayload, 'id'> & { completed: boolean }) => {
  const response = await apiService.apiFetch<TaskItem>('/tasks', {
    method: 'POST',
    body: JSON.stringify(newTask),
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
    // All state updates for async thunks are now handled in extraReducers.
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<TaskItem[]>) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
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
      });
  },
});

export const {
  // updateTask is now an async thunk, not a slice action.
  // It is exported above.
} = tasksSlice.actions;
export default tasksSlice.reducer;
