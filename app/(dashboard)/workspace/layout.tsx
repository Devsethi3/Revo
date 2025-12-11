// /workspace/layout.tsx

import { ReactNode } from "react";
import WorkspaceList from "./_components/WorkspaceList";
import CreateWorkspace from "./_components/CreateWorkspace";
import UserNav from "./_components/UserNav";
import { orpc } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";

const WorkspaceLayout = async ({ children }: { children: ReactNode }) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(orpc.workspace.list.queryOptions());
  return (
    <>
      <div className="flex w-full h-dvh overflow-hidden">
        {/* Workspace Sidebar - Hidden on mobile, visible on lg screens */}
        <div className="hidden lg:flex h-full w-14 xl:w-16 flex-col items-center bg-sidebar py-2 xl:py-3 px-1.5 xl:px-2 border-r border-border shrink-0">
          <HydrateClient client={queryClient}>
            <WorkspaceList />
          </HydrateClient>

          <div className="mt-3 xl:mt-4">
            <CreateWorkspace />
          </div>
          <div className="mt-auto">
            <HydrateClient client={queryClient}>
              <UserNav />
            </HydrateClient>
          </div>
        </div>
        {/* Main Content Area */}
        <div className="flex-1 flex min-w-0 overflow-hidden">{children}</div>
      </div>
    </>
  );
};

export default WorkspaceLayout;
