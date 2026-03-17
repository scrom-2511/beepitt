import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { ErrMsg } from '../../interfaces/ErrMsg.Interface';

interface ErrMsgsState {
  messages: ErrMsg[];
}

const initialState: ErrMsgsState = {
  messages: [],
};

export const ErrMsgsSlice = createSlice({
  name: 'errMsgs',
  initialState,
  reducers: {
    setErrMsgs: (state, action: PayloadAction<ErrMsg[]>) => {
      state.messages = action.payload;
    },
    addErrMsgs: (state, action: PayloadAction<ErrMsg>) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setErrMsgs, addErrMsgs } = ErrMsgsSlice.actions;

export const selectErrMsgs = (state: RootState) => state.errMsgs.messages;

export default ErrMsgsSlice.reducer;
