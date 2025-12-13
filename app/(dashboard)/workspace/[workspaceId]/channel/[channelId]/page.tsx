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
import { ThreadProvider, useThread } from "@/providers/ThreadProvider";
import { ChannelRealtimeProvider } from "@/providers/ChannelRealtimeProvider";

const ChannelPage = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const { isThreadOpen } = useThread();

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
    <ChannelRealtimeProvider channelId={channelId}>
      <div className="flex h-full w-full overflow-hidden">
        {/* Main Channel Content */}
        <div 
          className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${
            isThreadOpen ? 'hidden sm:flex' : 'flex'
          }`}
        >
          {/* Fixed Header */}
          {isLoading ? (
            <div className="flex items-center justify-between h-12 sm:h-14 px-3 sm:px-4 border-b shrink-0">
              <Skeleton className="h-5 sm:h-6 w-28 sm:w-40" />
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <Skeleton className="h-7 sm:h-8 w-20 sm:w-28 hidden xs:block" />
                <Skeleton className="h-7 sm:h-8 w-16 sm:w-20" />
                <Skeleton className="size-7 sm:size-8" />
              </div>
            </div>
          ) : (
            <ChannelHeader channelName={data?.channelName} />
          )}
          
          {/* Scrollable Messages Area */}
          <div className="flex-1 overflow-hidden min-h-0">
            <MessageList />
          </div>

          {/* Fixed Input */}
          <div className="border-t bg-background p-2 sm:p-3 lg:p-4 shrink-0">
            <MessageInputForm
              channelId={channelId}
              user={data?.currentUser as KindeUser<Record<string, unknown>>}
            />
          </div>
        </div>

        {/* Thread Sidebar - Full screen on mobile, side panel on larger screens */}
        {isThreadOpen && (
          <div className="w-full sm:w-80 md:w-96 lg:w-[400px] xl:w-[450px] shrink-0 border-l border-border bg-background">
            <ThreadSidebar
              user={data?.currentUser as KindeUser<Record<string, unknown>>}
            />
          </div>
        )}
      </div>
    </ChannelRealtimeProvider>
  );
};

const ThisIsTheChannelPage = () => {
  return (
    <ThreadProvider>
      <ChannelPage />
    </ThreadProvider>
  );
};

export default ThisIsTheChannelPage;