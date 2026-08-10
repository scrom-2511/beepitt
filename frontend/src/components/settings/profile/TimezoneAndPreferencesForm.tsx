import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ProfileDetailsAndPrefernces } from '@/requestHandler/settings/profile/getProfileDetailsAndPreferences.reqhandler';
import { updateTimeZoneAndPreferencesHandler } from '@/requestHandler/settings/profile/preferencesAndCityUpdater.reqhandler';
import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip';
import { useMutation } from '@tanstack/react-query';
import { CircleQuestionMark } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type TimezoneFormValues = {
  city: string;
  timezone: string;
};

export const TimezoneAndPreferencesForm = ({ profile }: { profile?: ProfileDetailsAndPrefernces }) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isDirty, isSubmitting },
  } = useForm<TimezoneFormValues>();

  useEffect(() => {
    if (profile) {
      reset({
        city: profile.city,
        timezone: profile.timezone,
      });
    }
  }, [profile, reset]);

  const { mutate: updatePreferencesAndCity, isPending } = useMutation({
    mutationFn: updateTimeZoneAndPreferencesHandler,
    onSuccess: (res) => {
      toast.success('Updated Successfuly!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: TimezoneFormValues) => {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: data.timezone });
    } catch (e) {
      toast.error('Please provide an IANA-formatted time zone.');
      return;
    }
    updatePreferencesAndCity(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 sm:gap-6 text-muted-foreground text-xs sm:text-sm">
        <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-5">
          <div className="flex-1">
            <Label htmlFor="city" className="text-xs sm:text-sm">
              City
            </Label>
            <Input
              id="city"
              className="h-10 sm:h-12 text-sm sm:text-base text-foreground placeholder:text-xs sm:placeholder:text-sm mt-1.5 sm:mt-2 px-3 sm:px-4"
              {...register('city', { required: true })}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Label htmlFor="timezone" className="text-xs sm:text-sm">
                Timezone
              </Label>
              <Tooltip>
                <TooltipTrigger type="button">
                  <CircleQuestionMark className="size-3.5 sm:size-4 text-muted-foreground/60" />
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-popover text-popover-foreground px-3 py-1.5 rounded-md text-xs shadow-md border animate-in fade-in zoom-in duration-200">
                  <p>IANA timeZone required. Eg: America/Chicago</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="timezone"
              className="h-10 sm:h-12 text-sm sm:text-base text-foreground placeholder:text-xs sm:placeholder:text-sm mt-1.5 sm:mt-2 px-3 sm:px-4"
              {...register('timezone', { required: true })}
            />
          </div>
        </div>

        {isDirty && (
          <Button
            type="submit"
            variant={isPending ? 'ghost' : 'default'}
            disabled={isSubmitting || isPending}
            className="w-full sm:w-auto min-w-30 h-12 font-bold mt-10"
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>
    </form>
  );
};

export default TimezoneAndPreferencesForm;
