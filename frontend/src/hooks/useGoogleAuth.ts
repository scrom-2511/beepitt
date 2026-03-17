import { googleAuthHandler } from '@/requestHandler/auth/GoogleAuth.reqhandler';
import { useMutation } from '@tanstack/react-query';

export const useGoogleAuth = () => {
  const { mutate: googleAuth } = useMutation({
    mutationFn: googleAuthHandler,
    onSuccess: (res) => {},
  });

  const handleGoogleLogin = async (response: any) => {
    const googleToken = response.credential;
    googleAuth({ token: googleToken });
  };

  return { handleGoogleLogin };
};
