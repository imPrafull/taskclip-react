import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskStatus } from '../../models/task';

interface FiltersState {
  selectedTaskNavItemId: string;
  selectedListId: string | null;
  sortBy: string;
  selectedStatus: TaskStatus | 'all';
}

const initialState: FiltersState = {
  selectedTaskNavItemId: 'all',
  selectedListId: null,
  sortBy: 'createdAt:asc',
  selectedStatus: 'all',
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
    setStatus: (state, action: PayloadAction<TaskStatus | 'all'>) => {
      state.selectedStatus = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
  },
});

export const { selectTaskNavItem, selectList, setSortBy, setStatus } = filtersSlice.actions;
export default filtersSlice.reducer;