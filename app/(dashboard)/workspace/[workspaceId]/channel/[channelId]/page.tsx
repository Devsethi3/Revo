"use client";

import { useParams } from "next/navigation";
import ChannelHeader from "./_components/ChannelHeader";
import MessageInputForm from "./_components/message/MessageInputForm";
import MessageList from "./_components/MessageList";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

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
          <ChannelHeader />
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
      </div>
    </>
  );
};

export default ChannelPage;
