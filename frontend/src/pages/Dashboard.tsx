import { AppSidebar } from "@/components/dashboard/AppSidebar";
import Billing from "@/components/dashboard/Billing";
import ClosedIssues from "@/components/dashboard/ClosedIssues";
import { OpenIssues } from "@/components/dashboard/OpenIssues";
import { UnseenIssues } from "@/components/dashboard/UnseenIssues";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import Settings from "./Settings";

export type DashboardState =
  | "Unseen Errors"
  | "Open Errors"
  | "Closed Errors"
  | "Unseen Errors"
  | "Seen Errors"
  | "Settings"
  | "Billing";

const Dashboard = () => {
  const [selected, setSelected] = useState<DashboardState>("Unseen Errors");
  return (
    <SidebarProvider className="h-full w-max-500 p-5">
      <AppSidebar selected={selected} setSelected={setSelected} />
      <div className="bg-background w-full h-full grid grid-rows-[70px_auto] rounded-2xl pb-5">
        <TopBar selected={selected} />
        <div className="overflow-y-scroll">
          {selected === "Unseen Errors" && <UnseenIssues />}
          {selected === "Open Errors" && <OpenIssues />}
          {selected === "Closed Errors" && <ClosedIssues />}
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