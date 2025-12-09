import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { client } from "@/lib/orpc";
import { Cloud } from "lucide-react";
import { redirect } from "next/navigation";
import CreateNewChannel from "./_components/CreateNewChannel";

interface WorkspacePageIdProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

const WorkspacePageId = async ({ params }: WorkspacePageIdProps) => {
  const { workspaceId } = await params;
  const { channels } = await client.channel.list();

  if (channels.length > 0) {
    return redirect(`/workspace/${workspaceId}/channel/${channels[0].id}`);
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 xl:p-16 flex flex-1 h-full overflow-auto">
      <Empty className="border border-dashed from-muted/50 to-background w-full h-full bg-linear-to-b from-30% flex items-center justify-center">
        <EmptyHeader className="max-w-sm mx-auto text-center px-4">
          <EmptyMedia variant="icon">
            <Cloud className="size-8 sm:size-10 md:size-12 lg:size-16" />
          </EmptyMedia>
          <EmptyTitle className="text-base sm:text-lg md:text-xl lg:text-2xl">
            No Channels yet!
          </EmptyTitle>
          <EmptyDescription className="text-xs sm:text-sm md:text-base">
            Create your first channel to get started.
          </EmptyDescription>
          <EmptyContent className="w-full max-w-[280px] sm:max-w-xs md:max-w-sm mx-auto px-2 sm:px-4">
            <CreateNewChannel />
          </EmptyContent>
        </EmptyHeader>
      </Empty>
    </div>
  );
};

export default WorkspacePageId;