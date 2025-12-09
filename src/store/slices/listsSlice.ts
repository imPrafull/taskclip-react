import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TaskListInfo } from '../../models/task';
import { apiService } from '../../api/api';

interface ListsState {
  lists: TaskListInfo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ListsState = {
  lists: [],
  status: 'idle',
  error: null,
};

export const fetchLists = createAsyncThunk('lists/fetchLists', async () => {
  const response = await apiService.apiFetch<TaskListInfo[]>('/lists');
  return response;
});

export const addNewList = createAsyncThunk('lists/addNewList', async (newList: Omit<TaskListInfo, 'id'>) => {
  const response = await apiService.apiFetch<TaskListInfo>('/lists', {
    method: 'POST',
    body: JSON.stringify(newList),
  });
  return response;
});

const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLists.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLists.fulfilled, (state, action: PayloadAction<TaskListInfo[]>) => {
        state.status = 'succeeded';
        state.lists = action.payload;
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(addNewList.fulfilled, (state, action: PayloadAction<TaskListInfo>) => {
        state.lists.push(action.payload);
      });
  },
});

export default listsSlice.reducer;
