import { createContext } from 'react';

export type AuthStep = 'signin' | 'signup' | 'otp' | 'profile';

export type AuthContextType = {
  step: AuthStep;
  setStep: (step: AuthStep) => void;
  animate: boolean;
  setAnimate: (value: boolean) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
