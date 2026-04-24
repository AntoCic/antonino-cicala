import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import authReducer from './db/auth/authSlice';
import faqReducer from './db/faq/faqSlice';
import appSettingsReducer from './db/appSettings/appSettingsSlice';
import skillReducer from './db/skills/skillSlice';
import projectReducer from './db/projects/projectSlice';
import experienceReducer from './db/experiences/experienceSlice';
import certificateReducer from './db/certificates/certificateSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    faq: faqReducer,
    appSettings: appSettingsReducer,
    skill: skillReducer,
    project: projectReducer,
    experience: experienceReducer,
    certificate: certificateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
