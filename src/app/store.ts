import { configureStore } from "@reduxjs/toolkit";
import { projectsApi } from "../features/projects/projectsApi";
import { internsApi } from "../features/interns/internsApi";
import { tasksApi } from "../features/tasks/tasksApi";
export const store = configureStore({
  reducer: {
    [projectsApi.reducerPath]: projectsApi.reducer,
    [internsApi.reducerPath]: internsApi.reducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(projectsApi.middleware)
      .concat(internsApi.middleware)
      .concat(tasksApi.middleware),
});
