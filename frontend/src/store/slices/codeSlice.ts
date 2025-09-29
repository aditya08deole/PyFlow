import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CodeState {
  currentCode: string;
  flowchartData: string;
  isLoading: boolean;
}

const initialState: CodeState = {
  currentCode: '',
  flowchartData: '',
  isLoading: false,
};

const codeSlice = createSlice({
  name: 'code',
  initialState,
  reducers: {
    setCode: (state, action: PayloadAction<string>) => {
      state.currentCode = action.payload;
    },
    setFlowchartData: (state, action: PayloadAction<string>) => {
      state.flowchartData = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCode, setFlowchartData, setLoading } = codeSlice.actions;
export default codeSlice.reducer;