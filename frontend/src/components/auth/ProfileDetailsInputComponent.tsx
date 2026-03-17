import { profileDetailsUpdateHandler } from '@/requestHandler/auth/ProfileDetailsUpdater.reqHandler';
import { useMutation } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ButtonComp from '../ButtonComp';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import AuthHeader from './AuthHeader';

type ProfileDetailsFormValue = {
  firstName: string;
  lastName: string;
};

const ProfileDetailsInputComponent = () => {
  return (
    <Card className="w-full h-full py-0 justify-center">
      <AuthHeader title="Your Profile" description="Enter your first name and last name" />
      <ProfileDetailsInputForm />
    </Card>
  );
};

export default ProfileDetailsInputComponent;

const ProfileDetailsInputForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileDetailsFormValue>();

  const { mutate: profileDetailsUpdate, isPending } = useMutation({
    mutationFn: profileDetailsUpdateHandler,
    onSuccess: (res) => {
      navigate('/dashboard');
    },
  });

  const onSubmit: SubmitHandler<ProfileDetailsFormValue> = (formData) => {
    profileDetailsUpdate(formData);
  };
  return (
    <CardContent className="mt-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          {/* First name Field */}
          <div className="grid gap-2">
            <Input
              id="firstName"
              type="text"
              placeholder="First name"
              className="py-6"
              autoComplete="off"
              {...register('firstName', {
                required: 'First name is required',
              })}
            />
            {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName.message}</span>}
          </div>

          {/* Last name Field */}
          <div className="grid gap-2">
            <Input
              id="lastName"
              type="text"
              placeholder="Last name"
              className="py-6"
              autoComplete="off"
              {...register('lastName', {
                required: 'Lastname name is required',
              })}
            />
            {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName.message}</span>}
          </div>
        </div>
        <CardFooter className="flex-col gap-2 mt-16 p-0">
          <ButtonComp variant={isPending ? 'secondary' : 'default'} type="submit" disabled={isPending}>
            {isPending ? 'Setting up your profile' : 'Sumbit'}
          </ButtonComp>
        </CardFooter>
      </form>
    </CardContent>
  );
};
