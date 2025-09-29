import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DebugState {
  isDebugging: boolean;
  currentLine: number | null;
  variables: Record<string, unknown>;
  executionHistory: number[];
}

const initialState: DebugState = {
  isDebugging: false,
  currentLine: null,
  variables: {},
  executionHistory: [],
};

const debugSlice = createSlice({
  name: 'debug',
  initialState,
  reducers: {
    startDebugging: state => {
      state.isDebugging = true;
      state.currentLine = 1;
      state.executionHistory = [];
    },
    stopDebugging: state => {
      state.isDebugging = false;
      state.currentLine = null;
      state.variables = {};
      state.executionHistory = [];
    },
    stepForward: state => {
      if (state.currentLine !== null) {
        state.executionHistory.push(state.currentLine);
        state.currentLine += 1;
      }
    },
    setCurrentLine: (state, action: PayloadAction<number>) => {
      state.currentLine = action.payload;
    },
    updateVariables: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.variables = action.payload;
    },
  },
});

export const { startDebugging, stopDebugging, stepForward, setCurrentLine, updateVariables } =
  debugSlice.actions;

export default debugSlice.reducer;
