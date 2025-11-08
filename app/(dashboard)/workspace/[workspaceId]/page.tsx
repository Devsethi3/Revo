import { Button } from "@/components/ui/button";
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
    <div className="p-16 flex flex-1">
      <Empty className="border border-dashed from-muted/50 to-background h-full bg-gradient-to-b from-30%">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Cloud />
          </EmptyMedia>
          <EmptyTitle>No Channels yet!</EmptyTitle>
          <EmptyDescription>
            Create your first channel to get started.
          </EmptyDescription>
          <EmptyContent className="max-w-sm mx-auto">
            <CreateNewChannel />
          </EmptyContent>
        </EmptyHeader>
      </Empty>
    </div>
  );
};

export default WorkspacePageId;
