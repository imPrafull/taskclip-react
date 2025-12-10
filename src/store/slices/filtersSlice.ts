import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  selectedTaskNavItemId: string;
  selectedListId: string | null;
  sortBy: string;
}

const initialState: FiltersState = {
  selectedTaskNavItemId: 'all',
  selectedListId: null,
  sortBy: 'createdAt:asc',
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
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
  },
});

export const { selectTaskNavItem, selectList, setSortBy } = filtersSlice.actions;
export default filtersSlice.reducer;