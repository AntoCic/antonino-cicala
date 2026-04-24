import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Certificate } from './Certificate';

interface CertificateState {
  certificates: Certificate[];
  loading: boolean;
}

const initialState: CertificateState = {
  certificates: [],
  loading: false,
};

const certificateSlice = createSlice({
  name: 'certificate',
  initialState,
  reducers: {
    setCertificates(state, action: PayloadAction<Certificate[]>) {
      state.certificates = action.payload;
      state.loading = false;
    },
    setCertificateLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    updateCertificateInStore(state, action: PayloadAction<Certificate>) {
      const idx = state.certificates.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) state.certificates[idx] = action.payload;
    },
    removeCertificateFromStore(state, action: PayloadAction<string>) {
      state.certificates = state.certificates.filter((c) => c.id !== action.payload);
    },
  },
});

export const { setCertificates, setCertificateLoading, updateCertificateInStore, removeCertificateFromStore } =
  certificateSlice.actions;
export default certificateSlice.reducer;
