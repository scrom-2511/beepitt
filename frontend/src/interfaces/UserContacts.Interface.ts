export interface EmailsContactInterface {
  primary: string;
  secondary: string;
  tertiary: string;
}

export interface PhoneNumsContactInterface {
  primary: string;
  secondary: string;
  tertiary: string;
}

export interface FinalContacts {
  emailIDs: EmailsContactInterface;
  phoneNums: PhoneNumsContactInterface;
}
