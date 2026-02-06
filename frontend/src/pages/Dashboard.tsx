import { AppSidebar } from "@/components/dashboard/AppSidebar";
import Billing from "@/components/dashboard/Billing";
import { SeenIncidents } from "@/components/dashboard/incidents/SeenIncidents";
import { UnseenIncidents } from "@/components/dashboard/incidents/UnseenIncidents";
import ClosedIssues from "@/components/dashboard/issues/ClosedIssues";
import { OpenIssues } from "@/components/dashboard/issues/OpenIssues";
import { UnseenIssues } from "@/components/dashboard/issues/UnseenIssues";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import Settings from "./Settings";

export type DashboardState =
  | "Unseen Issues"
  | "Open Issues"
  | "Closed Issues"
  | "Unseen Incidents"
  | "Seen Incidents"
  | "Settings"
  | "Billing";

const Dashboard = () => {
  const [selected, setSelected] = useState<DashboardState>("Unseen Incidents");
  return (
    <SidebarProvider className="h-full w-max-500 p-5">
      <AppSidebar selected={selected} setSelected={setSelected} />
      <div className="bg-background w-full h-full grid grid-rows-[70px_auto] rounded-2xl pb-5">
        <TopBar selected={selected} />
        <div className="overflow-y-scroll">
          {selected === "Unseen Incidents" && <UnseenIncidents />}
          {selected === "Seen Incidents" && <SeenIncidents />}
          {selected === "Unseen Issues" && <UnseenIssues />}
          {selected === "Open Issues" && <OpenIssues />}
          {selected === "Closed Issues" && <ClosedIssues />}
          {selected === "Settings" && <Settings />}
          {selected === "Billing" && <Billing />}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

const TopBar = ({ selected }: { selected: string }) => {
  return (
    <div>
      <div className="flex p-5 gap-5 items-center font-montserrat">
        <SidebarTrigger />
        <h1 className="text-foreground font-medium text-xl">{selected}</h1>
      </div>
      <div className="border border-foreground opacity-25"></div>
    </div>
  );
};