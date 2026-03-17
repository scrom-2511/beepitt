import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type {
  EmailsContactInterface,
  FinalContacts,
  PhoneNumsContactInterface,
} from '../../interfaces/UserContacts.Interface';

const initialState: FinalContacts = {
  emailIDs: { primary: '', secondary: '', tertiary: '' },
  phoneNums: { primary: '', secondary: '', tertiary: '' },
};

export const userContactInfoSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    setEmailsContact: (state, action: PayloadAction<EmailsContactInterface>) => {
      state.emailIDs = action.payload;
    },
    setPhoneNumsContact: (state, action: PayloadAction<PhoneNumsContactInterface>) => {
      state.phoneNums = action.payload;
    },
  },
});

export const { setEmailsContact, setPhoneNumsContact } = userContactInfoSlice.actions;

export const selectUserContact = (state: RootState) => state.userContactInfo;
export const selectUserContactEmailIDs = (state: RootState) => state.userContactInfo.emailIDs;
export const selectUserContactPhoneNums = (state: RootState) => state.userContactInfo.phoneNums;

export default userContactInfoSlice.reducer;
