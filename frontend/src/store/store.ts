import { configureStore } from '@reduxjs/toolkit';
import codeSlice from './slices/codeSlice';
import debugSlice from './slices/debugSlice';

export const store = configureStore({
  reducer: {
    code: codeSlice,
    debug: debugSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;