import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppSettings } from './AppSettings';

interface AppSettingsState {
  settings: AppSettings | null;
  loading: boolean;
}

const initialState: AppSettingsState = {
  settings: null,
  loading: false,
};

const appSettingsSlice = createSlice({
  name: 'appSettings',
  initialState,
  reducers: {
    setAppSettings(state, action: PayloadAction<AppSettings | null>) {
      state.settings = action.payload;
      state.loading = false;
    },
    setAppSettingsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setAppSettings, setAppSettingsLoading } = appSettingsSlice.actions;
export default appSettingsSlice.reducer;
