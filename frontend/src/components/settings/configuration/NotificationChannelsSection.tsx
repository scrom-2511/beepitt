import ButtonComp from '@/components/ButtonComp';
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
  slack: boolean;
  email: boolean;
  telegram: boolean;
  discord: boolean;
};

const allChannels: NotificationChannels[] = ['slack', 'email', 'telegram', 'discord'];

const NotificationChannelsSection = ({ configurations }: { configurations: ConfigurationsResponse }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty },
  } = useForm<FormValues>();

  const { mutate, isPending } = useMutation({
    mutationFn: updateNotificationChannelsHandler,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (configurations?.notificationChannels) {
      const initialValues: FormValues = {
        slack: false,
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
            channel !== 'slack' && (
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
            ),
        )}

        {isDirty && (
          <div className="w-full flex justify-center pt-4">
            <ButtonComp variant={isPending ? 'ghost' : 'default'} type="submit" disabled={isPending}>
              Save
            </ButtonComp>
          </div>
        )}
      </section>
    </form>
  );
};

export default NotificationChannelsSection;
