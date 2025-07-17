import { createSlice } from "@reduxjs/toolkit";
import type { Project } from "../types/project";

interface ProjectsState {
  projects: Project[];
}

const initialState: ProjectsState = {
  projects: [],
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects(state, action) {
      state.projects = action.payload;
    },
    addProject(state, action) {
      state.projects.unshift(action.payload);
    },
  },
});

export const { setProjects, addProject } = projectsSlice.actions;
export default projectsSlice.reducer;
