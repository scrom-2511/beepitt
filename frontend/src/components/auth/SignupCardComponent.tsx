import { useAuthState } from '@/hooks/useAuthState';
import useGoogleButton from '@/hooks/useGoogleButton';
import { signupHandler } from '@/requestHandler/auth/Signup.ReqHandler';
import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import AuthFooter from './AuthFooter';
import AuthHeader from './AuthHeader';

type SignupFormValues = {
  email: string;
  username: string;
  password: string;
};

const SignupCardComponent = () => {
  const { setStep } = useAuthState();

  return (
    <Card className="w-full h-full px-4 sm:px-10 md:px-16 py-0 flex flex-col justify-center">
      <AuthHeader
        title="Create an account"
        description="Have an account?"
        children={
          <Button
            className="pl-2 underline cursor-pointer text-sm sm:text-base"
            variant="link"
            onClick={() => {
              setStep('signin');
            }}
          >
            Log in
          </Button>
        }
      />
      <SignupCardForm />
    </Card>
  );
};

export default SignupCardComponent;

const SignupCardForm = () => {
  const hiddenGoogleBtnRef = useRef<HTMLDivElement | null>(null);

  useGoogleButton({ buttonRef: hiddenGoogleBtnRef });

  const { setStep, setAnimate } = useAuthState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>();

  const { mutate: signup, isPending } = useMutation({
    mutationFn: signupHandler,
    onSuccess: (res) => {
      setAnimate(false);
      setStep('otp');
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  const onSubmit: SubmitHandler<SignupFormValues> = (formData) => {
    signup({
      email: formData.email,
      username: formData.username,
      password: formData.password!,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC',
    });
  };

  return (
    <CardContent className="mt-2 sm:mt-6 md:mt-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Email Field */}
          <div className="grid gap-2">
            <Input
              autoFocus
              id="email"
              type="email"
              placeholder="m@example.com"
              className="py-4 sm:py-6 text-sm sm:text-base"
              autoComplete="off"
              {...register('email', {
                required: 'Email is required',
              })}
            />
            {errors.email && <span className="text-red-500 text-xs sm:text-sm">{errors.email.message}</span>}
          </div>

          {/* Username Field */}
          <div className="grid gap-2">
            <Input
              id="username"
              type="text"
              placeholder="Username"
              className="py-4 sm:py-6 text-sm sm:text-base"
              autoComplete="off"
              {...register('username', {
                required: 'Username is required',
              })}
            />
            {errors.username && <span className="text-red-500 text-xs sm:text-sm">{errors.username.message}</span>}
          </div>

          {/* Password Field */}
          <div className="grid gap-2">
            <Input
              id="password"
              type="password"
              placeholder="Password"
              className="py-4 sm:py-6 text-sm sm:text-base"
              autoComplete="off"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
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
