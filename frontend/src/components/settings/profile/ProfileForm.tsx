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
      <div className="flex flex-col gap-4 sm:gap-6 text-muted-foreground text-xs sm:text-sm">
        <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-5">
          <div className="flex-1">
            <Label htmlFor="firstName" className="text-xs sm:text-sm">
              First Name
            </Label>
            <Input
              id="firstName"
              className="h-10 sm:h-12 text-sm sm:text-base text-foreground placeholder:text-xs sm:placeholder:text-sm mt-1.5 sm:mt-2 px-3 sm:px-4"
              {...register('firstName', { required: true })}
            />
          </div>

          <div className="flex-1">
            <Label htmlFor="lastName" className="text-xs sm:text-sm">
              Last Name
            </Label>
            <Input
              id="lastName"
              className="h-10 sm:h-12 text-sm sm:text-base text-foreground placeholder:text-xs sm:placeholder:text-sm mt-1.5 sm:mt-2 px-3 sm:px-4"
              {...register('lastName', { required: true })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="text-xs sm:text-sm">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            readOnly
            className="h-10 sm:h-12 text-sm sm:text-base text-foreground placeholder:text-xs sm:placeholder:text-sm mt-1.5 sm:mt-2 px-3 sm:px-4 bg-muted/30"
            {...register('email', { required: true })}
          />
        </div>

        {isDirty && (
          <div className="w-full flex justify-center sm:justify-end pt-4 sm:pt-6">
            <ButtonComp
              variant={isPending ? 'ghost' : 'default'}
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto min-w-[120px]"
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </ButtonComp>
          </div>
        )}
      </div>
    </form>
  );
};

export default ProfileForm;
