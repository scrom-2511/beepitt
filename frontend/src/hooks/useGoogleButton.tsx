import { type RefObject, useEffect } from 'react';
import { useGoogleAuth } from './useGoogleAuth';

interface UseGoogleButtonProps {
  buttonRef: RefObject<HTMLDivElement | null>;
}

const useGoogleButton = ({ buttonRef }: UseGoogleButtonProps) => {
  const { handleGoogleLogin } = useGoogleAuth();

  useEffect(() => {
    if (!(window as any).google || !buttonRef.current) return;

    const google = (window as any).google;

    google.accounts.id.initialize({
      client_id: '969855643592-at1i6a3m0u49i795b5csti15ls7bq42o.apps.googleusercontent.com',
      callback: handleGoogleLogin,
    });

    google.accounts.id.renderButton(buttonRef.current, {
      theme: 'outline',
      size: 'large',
      shape: 'rectangular',
      text: 'sign_in_with',
      width: 280,
    });
  }, [buttonRef]);
};

export default useGoogleButton;
