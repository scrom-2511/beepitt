import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { type ConfigurationsResponse } from '@/requestHandler/settings/configurations/getConfigurationsHandler.reqhandler';
import { updateNotificationChannelsHandler } from '@/requestHandler/settings/configurations/updateNotificationChannels.reqhandler';
import { type NotificationChannels } from '@/types/applicationTypes';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type FormValues = {
  email: boolean;
  telegram: boolean;
  discord: boolean;
};

const allChannels: NotificationChannels[] = ['email', 'telegram', 'discord'];

const NotificationChannelsSection = ({ configurations }: { configurations: ConfigurationsResponse }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { isDirty },
  } = useForm<FormValues>();

  const { mutate, isPending } = useMutation({
    mutationFn: updateNotificationChannelsHandler,
    onSuccess: () => {
      reset(getValues());
      toast.success('Notification channels updated successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (configurations?.notificationChannels) {
      const initialValues: FormValues = {
        email: false,
        telegram: false,
        discord: false,
      };

      configurations.notificationChannels.forEach((ch) => {
        initialValues[ch] = true;
      });

      reset(initialValues);
    }
  }, [configurations, reset]);

  // Submit handler
  const onSubmit = (formData: FormValues) => {
    const selectedChannels = Object.entries(formData)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    mutate({ channels: selectedChannels as any });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <section className="flex flex-col gap-6 text-muted-foreground text-sm">
        {allChannels.map(
          (channel) =>
            <div key={channel} className="flex justify-between items-center">
              <Label className="text-foreground text-lg capitalize">{channel}</Label>

              <Checkbox
                className="size-8"
                checked={watch(channel)}
                onCheckedChange={(checked) => {
                  setValue(channel, !!checked, {
                    shouldDirty: true,
                  });
                }}
              />
            </div>
        )}

        {isDirty && (
          <div className="w-full flex justify-center pt-4">
            <Button className=' w-full font-bold h-12' variant={isPending ? 'ghost' : 'default'} type="submit" disabled={isPending}>
              Save
            </Button>
          </div>
        )}
      </section>
    </form>
  );
};

export default NotificationChannelsSection;
