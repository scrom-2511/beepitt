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
    <section className="relative h-[calc(100vh-135px)] w-full overflow-x-hidden overflow-y-auto">
      {!hideTabs && (
        <Tabs value={currentTab} onValueChange={(tabValue) => navigate(tabValue)} className="w-full min-w-0">
          <div className="w-full min-w-0 border-b px-4 sm:px-6">
            <TabsList className="scrollbar-none mt-5 flex h-12 w-full min-w-0 max-w-full justify-start gap-6 overflow-x-auto bg-transparent p-0 snap-x">
              {tabItems.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent relative h-12 shrink-0 snap-start rounded-none border-b-2 border-transparent bg-transparent px-2 pb-3 pt-4 text-sm font-medium text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:shadow-none"
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
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
