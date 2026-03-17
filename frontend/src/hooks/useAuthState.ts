import { AuthContext } from '@/contexts/AuthContext';
import { useContext } from 'react';

export const useAuthState = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthState must be used inside AuthProvider');
  }
  return ctx;
};
