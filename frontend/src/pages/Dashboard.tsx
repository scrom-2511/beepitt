import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Outlet, useLocation } from 'react-router-dom';

export type DashboardState =
  | 'Unseen Issues'
  | 'Open Issues'
  | 'Closed Issues'
  | 'Unseen Incidents'
  | 'Seen Incidents'
  | 'Settings'
  | 'Billing';

const Dashboard = () => {
  const location = useLocation();

  const selected = location.pathname.split('/').pop();

  return (
    <SidebarProvider className="h-full p-5">
      <AppSidebar />
      <div className="bg-background w-full h-full grid grid-rows-[70px_auto] rounded-2xl pb-5">
        <TopBar selected={selected} />
        <div className="overflow-y-scroll">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

const routeTitleMap: Record<string, string> = {
  'unseen-incidents': 'Unseen Incidents',
  'seen-incidents': 'Seen Incidents',
  'unseen-issues': 'Unseen Issues',
  'open-issues': 'Open Issues',
  'closed-issues': 'Closed Issues',
  settings: 'Settings',
  billing: 'Billing',
};

export const TopBar = ({ selected }: { selected: string | undefined }) => {
  const displayTitle = selected ? routeTitleMap[selected] || selected.charAt(0).toUpperCase() + selected.slice(1) : '';

  return (
    <div>
      <div className="flex p-5 gap-5 items-center font-montserrat">
        <SidebarTrigger />
        <h1 className="text-foreground font-medium text-xl">{displayTitle}</h1>
      </div>
      <div className="border border-foreground opacity-25"></div>
    </div>
  );
};
