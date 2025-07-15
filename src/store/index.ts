import { configureStore } from '@reduxjs/toolkit';
import internsReducer from './internsSlice.ts';

const store = configureStore({
  reducer: {
    interns: internsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
