import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { CircleCheckBigIcon, CircleXIcon, DollarSign, EyeOffIcon, LogOut, Settings } from 'lucide-react';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonComp from '../ButtonComp';

const issuesItems = [
  { title: 'Unseen Issues', url: '/dashboard/unseen-issues', icon: EyeOffIcon },
  { title: 'Open Issues', url: '/dashboard/open-issues', icon: CircleXIcon },
  { title: 'Closed Issues', url: '/dashboard/closed-issues', icon: CircleCheckBigIcon },
];

const incidentItems = [
  { title: 'Unseen Incidents', url: '/dashboard/unseen-incidents', icon: EyeOffIcon },
  { title: 'Seen Incidents', url: '/dashboard/seen-incidents', icon: CircleCheckBigIcon },
];

const items_footer = [
  { title: 'Settings', url: '/dashboard/settings', icon: Settings },
  { title: 'Billing', url: '/dashboard/billing', icon: DollarSign },
  { title: 'Log Out', url: '/auth', icon: LogOut },
];

const SidebarSectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="px-2 pt-4 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">{children}</div>
);

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const isActive = (url: string) => currentPath === url;

  return (
    <Sidebar variant="inset" className="p-5 bg-sidebar">
      <SidebarContent className="overflow-hidden">
        <SidebarHeader className="mb-4">logo aayega</SidebarHeader>

        {/* Incidents Section */}
        <SidebarSectionLabel>Incidents</SidebarSectionLabel>
        <SidebarMenu className="gap-2.5">
          {incidentItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              {/* <NavLink
                to={item.url}
                className={`flex w-full justify-start gap-5 text-md p-2 rounded-md ${
                  isActive(item.url) ? 'bg-primary text-background' : 'text-foreground hover:bg-foreground/10'
                }`}
              >
                <item.icon className="size-4.5" />
                {item.title}
              </NavLink> */}
              <ButtonComp
                variant={isActive(item.url) ? 'default' : 'ghost'}
                className="flex flex-row w-full justify-start gap-5 text-md cursor-pointer"
                onClick={() => {
                  navigate(item.url);
                }}
              >
                <item.icon className="size-4.5" />
                {item.title}
              </ButtonComp>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {/* Issues Section */}
        <SidebarSectionLabel>Issues</SidebarSectionLabel>
        <SidebarMenu className="gap-2.5">
          {issuesItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              {/* <NavLink
                to={item.url}
                className={`flex w-full justify-start gap-5 text-md p-2 rounded-md ${
                  isActive(item.url) ? 'bg-primary text-background' : 'text-foreground hover:bg-foreground/10'
                }`}
              >
                <item.icon className="size-4.5" />
                {item.title}
              </NavLink> */}
              <ButtonComp
                variant={isActive(item.url) ? 'default' : 'ghost'}
                className="flex flex-row w-full justify-start gap-5 text-md cursor-pointer"
                onClick={() => {
                  navigate(item.url);
                }}
              >
                <item.icon className="size-4.5" />
                {item.title}
              </ButtonComp>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu className="gap-2.5">
          {items_footer.map((item) => (
            <SidebarMenuItem key={item.title}>
              {/* <NavLink
                to={item.url}
                className={`flex w-full justify-start gap-5 text-md p-2 rounded-md ${
                  isActive(item.url) ? 'bg-primary text-background' : 'text-foreground hover:bg-foreground/10'
                }`}
              >
                <item.icon className="size-4.5" />
                {item.title}
              </NavLink> */}
              <ButtonComp
                variant={isActive(item.url) ? 'default' : 'ghost'}
                className="flex flex-row w-full justify-start gap-5 text-md cursor-pointer"
                onClick={() => {
                  navigate(item.url);
                }}
              >
                <item.icon className="size-4.5" />
                {item.title}
              </ButtonComp>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
