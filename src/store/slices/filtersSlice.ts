import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskStatus } from '../../models/task';
import { storageService, SORT_BY } from '../../lib/storage';

interface FiltersState {
  selectedTaskNavItemId: string;
  selectedListId: string | null;
  sortBy: string;
  selectedStatus: TaskStatus | 'all';
}

const savedSortBy = storageService.getItem(SORT_BY) ?? 'createdAt:asc';

const initialState: FiltersState = {
  selectedTaskNavItemId: 'all',
  selectedListId: null,
  sortBy: savedSortBy,
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
      try {
        storageService.setItem(SORT_BY, action.payload);
      } catch (e) {
        // ignore storage errors (e.g., private mode)
      }
    },
  },
});

export const { selectTaskNavItem, selectList, setSortBy, setStatus } = filtersSlice.actions;
export default filtersSlice.reducer;