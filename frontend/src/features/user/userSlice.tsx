import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { User } from '../../interfaces/User.Interface';

const initialState: User = {
  username: '(No Name)',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
  },
});

export const { setUsername } = userSlice.actions;

export const selectUsername = (state: RootState) => state.user.username;

export default userSlice.reducer;
