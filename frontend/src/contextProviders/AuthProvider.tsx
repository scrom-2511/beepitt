import { AuthContext, type AuthStep } from '@/contexts/AuthContext';
import { useState } from 'react';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
const [step, setStep] = useState<AuthStep>('signin');
  const [animate, setAnimate] = useState<boolean>(true);

  return <AuthContext.Provider value={{ step, setStep, animate, setAnimate }}>{children}</AuthContext.Provider>;
};
