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
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-primary/10">
            <Cloud className="size-5 text-primary" />
          </EmptyMedia>
          <EmptyTitle> No Channels yet!</EmptyTitle>
          <EmptyDescription>
            Create your first channel to get started.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyDescription className="text-xs sm:text-sm md:text-base"></EmptyDescription>
        <EmptyContent className="w-full max-w-[280px] sm:max-w-xs md:max-w-sm mx-auto px-2 sm:px-4">
          <CreateNewChannel />
        </EmptyContent>
      </Empty>
    </div>
  );
};

export default WorkspacePageId;
