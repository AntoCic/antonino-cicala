import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Experience } from './Experience';

interface ExperienceState {
  experiences: Experience[];
  loading: boolean;
}

const initialState: ExperienceState = {
  experiences: [],
  loading: false,
};

const experienceSlice = createSlice({
  name: 'experience',
  initialState,
  reducers: {
    setExperiences(state, action: PayloadAction<Experience[]>) {
      state.experiences = action.payload;
      state.loading = false;
    },
    setExperienceLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    updateExperienceInStore(state, action: PayloadAction<Experience>) {
      const idx = state.experiences.findIndex((e) => e.id === action.payload.id);
      if (idx !== -1) state.experiences[idx] = action.payload;
    },
    removeExperienceFromStore(state, action: PayloadAction<string>) {
      state.experiences = state.experiences.filter((e) => e.id !== action.payload);
    },
  },
});

export const { setExperiences, setExperienceLoading, updateExperienceInStore, removeExperienceFromStore } =
  experienceSlice.actions;
export default experienceSlice.reducer;
