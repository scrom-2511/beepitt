import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const tabItems = [
  { label: 'Profile', value: 'profile' },
  { label: 'Team', value: 'team' },
  { label: 'Projects', value: 'projects' },
  { label: 'Configurations', value: 'configurations' },
  { label: 'More Settings', value: 'more-settings' },
];

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the current tab from the URL
  const currentTab = location.pathname.split('/').pop() || 'profile';

  // Hide tabs if URL ends with a number (like /projects/1)
  const hideTabs = /\d+$/.test(location.pathname);

  return (
    <section className="relative w-full h-[calc(100vh-135px)] overflow-scroll">
      {!hideTabs && (
        <Tabs value={currentTab} onValueChange={(tabValue) => navigate(tabValue)} className="w-full p-0 sm:p-5">
          <TabsList className="w-full mt-5 flex gap-3 overflow-x-auto whitespace-nowrap snap-x snap-mandatory">
            {tabItems.map((item) => (
              <TabsTrigger key={item.value} value={item.value} className="flex-shrink-0 snap-start">
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* Always render the nested routes */}
      <div>
        <Outlet />
      </div>
    </section>
  );
};

export default Settings;
