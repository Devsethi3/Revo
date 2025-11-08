"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import MessageItem from "./message/MessageItem";
import { orpc } from "@/lib/orpc";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const MessageList = () => {
  const { channelId } = useParams<{ channelId: string }>();

  const infiniteOptions = orpc.message.list.infiniteOptions({
    input: (pageParam: string | undefined) => ({
      channelId: channelId,
      cursor: pageParam,
      limit: 30,
    }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    select: (data) => ({
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
  });

  const query = useInfiniteQuery({
    ...infiniteOptions,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const items = useMemo(() => {
    return query.data?.pages.flatMap((p) => p.items) ?? [];
  }, [query.data]);

  return (
    <>
      <div className="relative h-full">
        <div className="h-full overflow-y-auto px-4">
          {items?.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))}
        </div>
      </div>
    </>
  );
};

export default MessageList;
