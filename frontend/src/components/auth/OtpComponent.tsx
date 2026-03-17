import { useAuthState } from '@/hooks/useAuthState';
import { otpValidatorHandler } from '@/requestHandler/auth/OtpValidator.ReqHandler';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import ButtonComp from '../ButtonComp';
import { Card, CardContent, CardFooter } from '../ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import AuthHeader from './AuthHeader';

const OtpComponent = () => {
  const [otpValue, setOtpValue] = useState<string>('');
  const maxLength = 4;
  const { setStep } = useAuthState();
  const { mutate: otpValidator, isPending } = useMutation({
    mutationFn: otpValidatorHandler,
    onSuccess: (res) => {
      setStep('profile');
    },
  });
  return (
    <Card className="h-full w-full flex flex-col justify-between px-16 py-24">
      <div className="flex flex-col">
        <AuthHeader title="Verify Code" description="We sent you a verification code to you mail address" />
        <CardContent className="mt-2 sm:mt-6 md:mt-8">
          <InputOTP
            maxLength={maxLength}
            className="h-full w-full"
            value={otpValue}
            onChange={(value) => {
              if (value.length === maxLength) {
              }
              setOtpValue(value);
            }}
          >
            <InputOTPGroup className="text-foreground h-full w-full">
              {[0, 1, 2, 3].map((el) => (
                <InputOTPSlot index={el} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </CardContent>
      </div>
      <CardFooter>
        <ButtonComp variant={isPending ? 'secondary' : 'default'} onClick={() => otpValidator({ otp: otpValue })}>
          {isPending ? 'Checking otp' : 'Submit'}
        </ButtonComp>
      </CardFooter>
    </Card>
  );
};

export default OtpComponent;
