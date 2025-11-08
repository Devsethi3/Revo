"use client";

import { useQuery } from "@tanstack/react-query";
import MessageItem from "./message/MessageItem";
import { orpc } from "@/lib/orpc";
import { useParams } from "next/navigation";

const MessageList = () => {
  const { channelId } = useParams<{ channelId: string }>();

  const { data } = useQuery(
    orpc.message.list.queryOptions({
      input: {
        channelId,
      },
    })
  );

  return (
    <>
      <div className="relative h-full">
        <div className="h-full overflow-y-auto px-4">
          {data?.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))}
        </div>
      </div>
    </>
  );
};

export default MessageList;
