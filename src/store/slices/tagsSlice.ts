import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Tag } from '../../models/task';
import { apiService } from '../../api/api';

interface TagsState {
  tags: Tag[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TagsState = {
  tags: [],
  status: 'idle',
  error: null,
};

export const fetchTags = createAsyncThunk('tags/fetchTags', async () => {
  const response = await apiService.apiFetch<Tag[]>('/tags');
  return response;
});

export const addNewTag = createAsyncThunk('tags/addNewTag', async (newTag: Omit<Tag, 'id'>) => {
  const response = await apiService.apiFetch<Tag>('/tags', {
    method: 'POST',
    body: JSON.stringify(newTag),
  });
  return response;
});

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    addTag: (state, action: PayloadAction<Tag>) => {
      state.tags.push(action.payload);
    },
    removeTag: (state, action: PayloadAction<string>) => {
      state.tags = state.tags.filter(t => t.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTags.fulfilled, (state, action: PayloadAction<Tag[]>) => {
        state.status = 'succeeded';
        state.tags = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(addNewTag.fulfilled, (state, action: PayloadAction<Tag>) => {
        state.tags.push(action.payload);
      });
  },
});

export const { addTag, removeTag } = tagsSlice.actions;
export default tagsSlice.reducer;
