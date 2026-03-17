import Fallback from '@/components/dashboard/Fallback';
import { Loading } from '@/components/Loading';
import { CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getProfileDetailsAndPreferences } from '@/requestHandler/settings/profile/getProfileDetailsAndPreferences.reqhandler';
import { useQuery } from '@tanstack/react-query';
import ProfileForm from './ProfileForm';
import TimezoneAndPreferencesForm from './TimezoneAndPreferencesForm';

const ProfileSection = () => {
  const {
    data: profile,
    isPending,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['profileDetailsAndPreferences'],
    queryFn: getProfileDetailsAndPreferences,
  });

  if (isError || isLoading) {
    return <Fallback data={undefined} error={error} isError={isError} isLoading={isLoading} refetch={refetch} emptyTitle='Settings' />;
  }

  const sections = [
    {
      title: 'Profile',
      description: 'Set your account details',
      content: <ProfileForm profile={profile} />,
    },
    {
      title: 'Timezone & Preferences',
      description: 'Set your timezone and format',
      content: <TimezoneAndPreferencesForm profile={profile} />,
    },
  ];

  if (isPending || isLoading) {
    return <Loading title="Profile Details" />;
  }

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

export default ProfileSection;
