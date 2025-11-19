import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TaskItem } from '../../models/task';
import { apiService } from '../../lib/apiService';

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

export const addNewTask = createAsyncThunk('tasks/addNewTask', async (newTask: Omit<TaskItem, 'id'>) => {
  const response = await apiService.apiFetch<TaskItem>('/tasks', {
    method: 'POST',
    body: JSON.stringify(newTask),
  });
  return response;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    updateTask: (state, action: PayloadAction<TaskItem>) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
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
      });
  },
});

export const { updateTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;
