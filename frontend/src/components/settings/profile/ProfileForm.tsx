import ButtonComp from '@/components/ButtonComp';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { profileDetailsUpdateHandler } from '@/requestHandler/auth/ProfileDetailsUpdater.reqHandler';
import type { ProfileDetailsAndPrefernces } from '@/requestHandler/settings/profile/getProfileDetailsAndPreferences.reqhandler';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
};

const ProfileForm = ({ profile }: { profile?: ProfileDetailsAndPrefernces }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<ProfileFormValues>();

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        username: '',
      });
    }
  }, [profile, reset]);

  const { mutate: profileDetailsUpdate, isPending } = useMutation({
    mutationFn: profileDetailsUpdateHandler,
    onSuccess: (res) => {
      toast.success('Updated Successfuly!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    console.log('Profile Data:', data);
    profileDetailsUpdate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6 text-muted-foreground text-sm">
        <div className="flex w-full gap-5">
          <div className=" flex-1">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              className="py-4 sm:py-6 text-foreground placeholder:text-xs sm:placeholder:text-sm mt-2"
              {...register('firstName', { required: true })}
            />
          </div>

          <div className=" flex-1">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              className="py-4 sm:py-6 text-foreground placeholder:text-xs sm:placeholder:text-sm mt-2"
              {...register('lastName', { required: true })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            readOnly
            className="py-4 sm:py-6 text-foreground placeholder:text-xs sm:placeholder:text-sm mt-2"
            {...register('email', { required: true })}
          />
        </div>

        {isDirty && (
          <div className="w-full flex justify-center pt-4">
            <ButtonComp variant={isPending ? 'ghost' : 'default'} type="submit" disabled={isPending}>
              Save
            </ButtonComp>
          </div>
        )}
      </div>
    </form>
  );
};

export default ProfileForm;
