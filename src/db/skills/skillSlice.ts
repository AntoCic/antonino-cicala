import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Skill } from './Skill';

interface SkillState {
  skills: Skill[];
  loading: boolean;
}

const initialState: SkillState = {
  skills: [],
  loading: false,
};

const skillSlice = createSlice({
  name: 'skill',
  initialState,
  reducers: {
    setSkills(state, action: PayloadAction<Skill[]>) {
      state.skills = action.payload;
      state.loading = false;
    },
    setSkillLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    updateSkillInStore(state, action: PayloadAction<Skill>) {
      const idx = state.skills.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) state.skills[idx] = action.payload;
    },
    removeSkillFromStore(state, action: PayloadAction<string>) {
      state.skills = state.skills.filter((s) => s.id !== action.payload);
    },
  },
});

export const { setSkills, setSkillLoading, updateSkillInStore, removeSkillFromStore } = skillSlice.actions;
export default skillSlice.reducer;
