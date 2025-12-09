import { ReactNode } from "react";
import WorkspaceHeader from "./_components/WorkspaceHeader";
import CreateNewChannel from "./_components/CreateNewChannel";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import ChannelList from "./_components/ChannelList";
import WorkspaceMembersList from "./_components/WorkspaceMembersList";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
import { orpc } from "@/lib/orpc";
import { SidebarProvider } from "@/providers/SidebarProvider";
import ChannelSidebar from "./channel/[channelId]/_components/ChannelSidebar";

const ChannelListLayout = async ({ children }: { children: ReactNode }) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(orpc.channel.list.queryOptions());

  return (
    <SidebarProvider defaultOpen={true}>
      <HydrateClient client={queryClient}>
        <ChannelSidebar />
      </HydrateClient>

      {/* Main Content */}
      <div className="flex-1 flex min-w-0 overflow-hidden">{children}</div>
    </SidebarProvider>
  );
};

export default ChannelListLayout;
