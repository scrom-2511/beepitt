import { useAuthState } from '@/hooks/useAuthState';
import useGoogleButton from '@/hooks/useGoogleButton';
import { signinHandler } from '@/requestHandler/auth/Signin.ReqHandler';
import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import AuthFooter from './AuthFooter';
import AuthHeader from './AuthHeader';

type SigninFormValues = {
  email: string;
  password: string;
};

const SigninCardComponent = () => {
  const { setStep } = useAuthState();

  return (
    <Card className="w-full h-full px-4 sm:px-10 md:px-16 py-0 flex flex-col justify-center">
      <AuthHeader
        title="Log in"
        description="Don't have an account?"
        children={
          <Button
            className="pl-2 underline cursor-pointer text-xs sm:text-base"
            variant="link"
            onClick={() => {
              setStep('signup');
            }}
          >
            Create an account
          </Button>
        }
      />
      <SigninCardForm />
    </Card>
  );
};

export default SigninCardComponent;

const SigninCardForm = () => {
  const navigate = useNavigate();
  const hiddenGoogleBtnRef = useRef<HTMLDivElement | null>(null);
  const { setStep } = useAuthState();

  useGoogleButton({
    buttonRef: hiddenGoogleBtnRef,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>();

  const {
    data,
    mutate: signin,
    isPending,
  } = useMutation({
    mutationFn: signinHandler,
    onSuccess: (res) => {
      toast.success('Signed in successfully');
      localStorage.setItem('timeZone', res.timeZone);
      localStorage.setItem('userSubscriptionTier', res.userSubscriptionTier);
      console.log(res.timeZone);
      navigate('/dashboard/unseen-incidents');
    },
    onError: (error) => {
      if (error.message === 'Verify otp from your email.') {
        setStep('otp');
        return;
      }
      toast.error(error.message);
    },
  });

  const onSubmit: SubmitHandler<SigninFormValues> = (formData) => {
    signin({
      email: formData.email,
      password: formData.password!,
    });
  };

  return (
    <CardContent className="mt-2 sm:mt-6 md:mt-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Email Field */}
          <div className="grid gap-2">
            <Input
              defaultValue="use@use.com"
              autoFocus
              id="email"
              type="email"
              placeholder="Email"
              className="py-4 sm:py-6 text-sm sm:text-base"
              autoComplete="off"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <span className="text-red-500 text-xs sm:text-sm">{errors.email.message}</span>}
          </div>

          {/* Password Field */}
          <div className="grid gap-2">
            <div className="flex items-center">
              {/* <a
                href="#"
                className="ml-auto text-xs sm:text-sm underline-offset-4 hover:underline"
              >
                Reset Password
              </a> */}
            </div>

            <Input
              defaultValue="use1234"
              id="password"
              type="text"
              placeholder="Password"
              className="py-4 sm:py-6 text-sm sm:text-base"
              autoComplete="off"
              {...register('password', {
                required: 'Password is required',
              })}
            />

            {errors.password && <span className="text-red-500 text-xs sm:text-sm">{errors.password.message}</span>}
          </div>
        </div>
        <AuthFooter hiddenGoogleBtnRef={hiddenGoogleBtnRef} isPending={isPending} />
      </form>
    </CardContent>
  );
};
