import { useAuthState } from '@/hooks/useAuthState';
import type { RefObject } from 'react';
import { FaGoogle } from 'react-icons/fa';
import ButtonComp from '../ButtonComp';
import { CardFooter } from '../ui/card';

interface AuthFooterProps {
  hiddenGoogleBtnRef: RefObject<HTMLDivElement | null>;
  isPending: boolean;
}
const AuthFooter = ({ hiddenGoogleBtnRef, isPending }: AuthFooterProps) => {
  const { step } = useAuthState();
  return (
    <CardFooter className="flex-col mt-16 gap-6 p-0">
      <ButtonComp variant={isPending ? 'secondary' : 'default'} type="submit" disabled={isPending}>
        {isPending ? 'Loading' : step === 'signin' ? 'Log in' : 'Create an account'}
      </ButtonComp>

      {/* Google button rendered here */}
      <div ref={hiddenGoogleBtnRef} style={{ display: 'none' }} />
      <ButtonComp
        type="button"
        variant="outline"
        onClick={() => {
          const btn = hiddenGoogleBtnRef.current?.querySelector('div[role=button]') as HTMLElement | null;

          btn?.click();
        }}
      >
        <FaGoogle />
        Continue with Google
      </ButtonComp>
    </CardFooter>
  );
};

export default AuthFooter;
