import projectsReducer from "./projectsSlice";
import { configureStore } from "@reduxjs/toolkit";
import internsReducer from "./internsSlice";

const store = configureStore({
  reducer: {
    interns: internsReducer,
    projects: projectsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
