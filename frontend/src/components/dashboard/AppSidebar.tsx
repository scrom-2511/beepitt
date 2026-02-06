import {
  CircleCheckBigIcon,
  CircleXIcon,
  DollarSign,
  EyeOffIcon,
  LogOut,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { DashboardState } from "@/pages/Dashboard";
import React from "react";
import ButtonComp from "../ButtonComp";

const issuesItems = [
  {
    title: "Unseen Issues",
    url: "#",
    icon: EyeOffIcon,
  },
  {
    title: "Open Issues",
    url: "#",
    icon: CircleXIcon,
  },
  {
    title: "Closed Issues",
    url: "#",
    icon: CircleCheckBigIcon,
  },
];

const incidentItems = [
  {
    title: "Unseen Incidents",
    url: "#",
    icon: CircleXIcon,
  },
  {
    title: "Seen Incidents",
    url: "#",
    icon: CircleCheckBigIcon,
  },
];


const items_footer = [
  { title: "Settings", url: "", icon: Settings },
  { title: "Billing", url: "", icon: DollarSign },
  { title: "Log Out", url: "", icon: LogOut },
];

const SidebarSectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="px-2 pt-4 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
    {children}
  </div>
);

export function AppSidebar({
  selected,
  setSelected,
}: {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<DashboardState>>;
}) {
  return (
    <Sidebar variant="inset" className="p-5">
      <SidebarContent className="overflow-hidden">
        <SidebarHeader className="mb-4">logo aayega</SidebarHeader>

        {/*  Incidents Section  */}
        <SidebarSectionLabel>Incidents</SidebarSectionLabel>
        <SidebarMenu className="gap-2.5">
          {incidentItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <ButtonComp
                variant={selected === item.title ? "default" : "ghost"}
                className="flex w-full justify-start gap-5 text-md"
                onClick={() =>
                  setSelected(item.title as DashboardState)
                }
              >
                <item.icon className="size-4.5" />
                {item.title}
              </ButtonComp>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {/*  Issues Section  */}
        <SidebarSectionLabel>Issues</SidebarSectionLabel>
        <SidebarMenu className="gap-2.5">
          {issuesItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <ButtonComp
                variant={selected === item.title ? "default" : "ghost"}
                className="flex w-full justify-start gap-5 text-md"
                onClick={() =>
                  setSelected(item.title as DashboardState)
                }
              >
                <item.icon className="size-4.5" />
                {item.title}
              </ButtonComp>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SideBarFooterComp selected={selected} setSelected={setSelected} />
    </Sidebar>
  );
}


const SideBarFooterComp = ({
  selected,
  setSelected,
}: {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<DashboardState>>;
}) => {
  return (
    <SidebarFooter>
      <SidebarMenu className="gap-2.5">
        {items_footer.map((item) => (
          <SidebarMenuItem>
            <ButtonComp
              variant={selected === item.title ? "default" : "ghost"}
              className="flex flex-row w-full justify-start gap-5 text-md cursor-pointer"
              onClick={() => {
                setSelected(item.title as DashboardState);
              }}
            >
              <item.icon className="size-4.5" />
              {item.title}
            </ButtonComp>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarFooter>
  );
};
