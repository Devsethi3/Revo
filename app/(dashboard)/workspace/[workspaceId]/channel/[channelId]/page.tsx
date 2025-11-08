"use client";

import { useParams } from "next/navigation";
import ChannelHeader from "./_components/ChannelHeader";
import MessageInputForm from "./_components/message/MessageInputForm";
import MessageList from "./_components/MessageList";

const ChannelPage = () => {
  const {channelId} = useParams<{ channelId: string }>();
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
            <MessageInputForm channelId={channelId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChannelPage;
