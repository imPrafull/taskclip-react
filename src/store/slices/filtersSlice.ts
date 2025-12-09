import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  selectedTaskNavItemId: string;
  selectedListId: string | null;
}

const initialState: FiltersState = {
  selectedTaskNavItemId: 'all',
  selectedListId: null,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    selectTaskNavItem: (state, action: PayloadAction<string>) => {
      state.selectedTaskNavItemId = action.payload;
    },
    selectList: (state, action: PayloadAction<string | null>) => {
      state.selectedListId = action.payload;
      state.selectedTaskNavItemId = 'all';
    },
  },
});

export const { selectTaskNavItem, selectList } = filtersSlice.actions;
export default filtersSlice.reducer;