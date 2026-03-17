import Fallback from '@/components/dashboard/Fallback';
import { CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { getConfigurationsHandler } from '@/requestHandler/settings/configurations/getConfigurationsHandler.reqhandler';
import { useQuery } from '@tanstack/react-query';
const ConfigurationSection = () => {
  const {
    data: projectDetails,
    isLoading,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['getConfigurations'],
    queryFn: () => getConfigurationsHandler,
  });

  if (isError || !projectDetails)
    return (
      <Fallback
        data={undefined}
        error={error}
        isError={isError}
        isLoading={isLoading}
        refetch={refetch}
        emptyTitle="Settings"
        loadingTitle="project details"
        addNew={false}
      />
    );
  const sections = [
    {
      title: 'Notification Channels',
      description: 'Select your notification channels',
      content: <NotificationChannels />,
    },
    {
      title: 'Throttling',
      description: 'Configure throttling. Throttling will take effect after at least one notification is sent',
      content: <Throttling />,
    },
  ];

  return (
    <section>
      {sections.map((section, index) => (
        <div key={section.title}>
          {index !== 0 && <Separator />}

          <div className="w-full h-auto rounded-2xl grid grid-rows-[100px_auto] mb-5">
            <div className="flex flex-col h-full w-full p-5 lg:p-10">
              <h1 className="text-foreground text-xl mb-2 font-montserrat">{section.title}</h1>
              <p className="text-muted-foreground text-sm">{section.description}</p>
            </div>

            <div>
              <CardContent className="p-5 lg:p-10">{section.content}</CardContent>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};
export default ConfigurationSection;

const NotificationChannels = () => {
  const channels = ['slack', 'email', 'telegram', 'discord'];

  return (
    <section className="flex flex-col gap-6 text-muted-foreground text-sm">
      <FieldGroup className="w-full">
        {channels.map((channel) => (
          <Field key={channel} orientation="horizontal" className="flex justify-between">
            <Label
              htmlFor={`${channel}-checkbox`}
              className="text-foreground text-lg mb-2 font-poppins font-light capitalize"
            >
              {channel}
            </Label>

            <Checkbox className="size-8" id={`${channel}-checkbox`} name={`${channel}-checkbox`} />
          </Field>
        ))}
      </FieldGroup>
    </section>
  );
};

const Throttling = () => {
  return (
    <section className="flex items-center text-foreground gap-4 text-sm">
      <h1 className="font-poppins font-light text-lg">Send a new notification for the same event after,</h1>
      <Input className="w-20 text-center" />
      <Select>
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder="Time units" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="sec">seconds</SelectItem>
            <SelectItem value="minutes">minutes</SelectItem>
            <SelectItem value="hours">hours</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </section>
  );
};
