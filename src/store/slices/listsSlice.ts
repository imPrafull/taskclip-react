import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TaskListInfo } from '../../models/task';
import { apiService } from '../../api/api';
import { CreateListPayload, deleteList as apiDeleteList, updateList as apiUpdateList } from '../../api/lists';

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

export const addNewList = createAsyncThunk('lists/addNewList', async (newList: CreateListPayload) => {
  const response = await apiService.apiFetch<TaskListInfo>('/lists', {
    method: 'POST',
    body: JSON.stringify(newList),
  });
  return response;
});

export const deleteList = createAsyncThunk('lists/deleteList', async (id: string) => {
  await apiDeleteList(id);
  return id;
});

export const updateList = createAsyncThunk('lists/updateList', async ({ id, data }: { id: string; data: Partial<CreateListPayload> }) => {
  const response = await apiUpdateList(id, data as { name?: string; description?: string; color?: string });
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
      builder.addCase(deleteList.fulfilled, (state, action: PayloadAction<string>) => {
        state.lists = state.lists.filter((l) => l.id !== action.payload);
      });
      builder.addCase(updateList.fulfilled, (state, action: PayloadAction<TaskListInfo>) => {
        state.lists = state.lists.map((l) => (l.id === action.payload.id ? action.payload : l));
      });
  },
});

export default listsSlice.reducer;
