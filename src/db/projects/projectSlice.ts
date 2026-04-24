import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Project } from './Project';

interface ProjectState {
  projects: Project[];
  loading: boolean;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjects(state, action: PayloadAction<Project[]>) {
      state.projects = action.payload;
      state.loading = false;
    },
    setProjectLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    updateProjectInStore(state, action: PayloadAction<Project>) {
      const idx = state.projects.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.projects[idx] = action.payload;
    },
    removeProjectFromStore(state, action: PayloadAction<string>) {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
    },
  },
});

export const { setProjects, setProjectLoading, updateProjectInStore, removeProjectFromStore } = projectSlice.actions;
export default projectSlice.reducer;
