import Fallback from '@/components/dashboard/Fallback';
import { CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getConfigurationsHandler } from '@/requestHandler/settings/configurations/getConfigurationsHandler.reqhandler';
import { useQuery } from '@tanstack/react-query';
import NotificationChannels from './NotificationChannelsSection';
import ThrottlingSection from './ThrottlingSection';
const ConfigurationSection = () => {
  const {
    data: configurations,
    isLoading,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['getConfigurations'],
    queryFn: getConfigurationsHandler,
  });

  if (isError || !configurations)
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
      content: <NotificationChannels configurations={configurations} />,
    },
    {
      title: 'Throttling',
      description: 'Configure throttling. Throttling will take effect after at least one notification is sent',
      content: <ThrottlingSection configurations={configurations} />,
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
