// workspace/[workspaceId]/layout.tsx
import { ReactNode } from "react";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
import { orpc } from "@/lib/orpc";
import { SidebarProvider } from "@/providers/SidebarProvider";
import { SearchProvider } from "@/providers/SearchProvider";
import { ThreadProvider } from "@/providers/ThreadProvider";
import ChannelSidebar from "./channel/[channelId]/_components/ChannelSidebar";
import { SearchDialog } from "./channel/[channelId]/_components/message/SearchDialog";

const ChannelListLayout = async ({ children }: { children: ReactNode }) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(orpc.channel.list.queryOptions());

  return (
    <SidebarProvider defaultOpen={true}>
      <ThreadProvider>
        <SearchProvider>
          <HydrateClient client={queryClient}>
            <ChannelSidebar />
          </HydrateClient>

          {/* Main Content */}
          <div className="flex-1 flex min-w-0 overflow-hidden">{children}</div>

          {/* Search Dialog - rendered at layout level */}
          <SearchDialog />
        </SearchProvider>
      </ThreadProvider>
    </SidebarProvider>
  );
};

export default ChannelListLayout;