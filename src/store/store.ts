import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
import listsReducer from './slices/listsSlice';
import tagsReducer from './slices/tagsSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    lists: listsReducer,
    tags: tagsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
