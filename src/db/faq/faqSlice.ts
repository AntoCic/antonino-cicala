import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Faq } from './Faq';

interface FaqState {
  faqs: Faq[];
  loading: boolean;
}

const initialState: FaqState = {
  faqs: [],
  loading: false,
};

const faqSlice = createSlice({
  name: 'faq',
  initialState,
  reducers: {
    setFaqs(state, action: PayloadAction<Faq[]>) {
      state.faqs = action.payload;
      state.loading = false;
    },
    setFaqLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    updateFaqInStore(state, action: PayloadAction<Faq>) {
      const idx = state.faqs.findIndex((f) => f.id === action.payload.id);
      if (idx !== -1) state.faqs[idx] = action.payload;
    },
    removeFaqFromStore(state, action: PayloadAction<string>) {
      state.faqs = state.faqs.filter((f) => f.id !== action.payload);
    },
  },
});

export const { setFaqs, setFaqLoading, updateFaqInStore, removeFaqFromStore } = faqSlice.actions;
export default faqSlice.reducer;
