"use client";

import { useParams } from "next/navigation";
import ChannelHeader from "./_components/ChannelHeader";
import MessageInputForm from "./_components/message/MessageInputForm";
import MessageList from "./_components/MessageList";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import ThreadSidebar from "./_components/thread/ThreadSidebar";

const ChannelPage = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const { data, error, isLoading } = useQuery(
    orpc.channel.get.queryOptions({
      input: {
        channelId: channelId,
      },
    })
  );

  if (error) {
    return <p>error</p>;
  }
  return (
    <>
      <div className="flex h-screen w-full">
        <div className="flex flex-col flex-1 min-w-0">
          {/* Fixed Header */}

          {isLoading ? (
            <div className="flex items-center justify-between h-14 px-4 border-b">
              <Skeleton className="h-6 w-40" />

              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="size-8" />
              </div>
            </div>
          ) : (
            <ChannelHeader channelName={data?.channelName} />
          )}
          {/* Scrollable Messages Area */}
          <div className="flex-1 overflow-hidden mb-4">
            <MessageList />
          </div>

          {/* Fixed Input */}
          <div className="border-t bg-background p-4">
            <MessageInputForm
              channelId={channelId}
              user={data?.currentUser as KindeUser<Record<string, unknown>>}
            />
          </div>
        </div>

        <ThreadSidebar />
      </div>
    </>
  );
};

export default ChannelPage;
