import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tag } from '../../models/task';

interface TagsState {
  tags: Tag[];
}

const initialState: TagsState = {
  tags: [],
};

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
});

export const { addTag, removeTag } = tagsSlice.actions;
export default tagsSlice.reducer;
