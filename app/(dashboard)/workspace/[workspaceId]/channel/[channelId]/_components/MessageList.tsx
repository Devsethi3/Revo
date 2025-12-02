"use client";

import { useInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import MessageItem from "./message/MessageItem";
import { orpc } from "@/lib/orpc";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/general/EmptyState";
import { ChevronDown, Loader2 } from "lucide-react";

const MessageList = () => {
  const { channelId } = useParams<{ channelId: string }>();

  const [hasInitialScrolled, setHasInitialScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const lastItemIdRef = useRef<string | undefined>(undefined);

  const infiniteOptions = orpc.message.list.infiniteOptions({
    input: (pageParam: string | undefined) => ({
      channelId: channelId,
      cursor: pageParam,
      limit: 10,
    }),
    queryKey: ["message.list", channelId],
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    select: (data) => ({
      // pages: [...data.pages].reverse(),
      pages: [...data.pages]
        .map((p) => ({
          ...p,
          items: [...p.items].reverse(),
        }))
        .reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    isFetching,
  } = useInfiniteQuery({
    ...infiniteOptions,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const {
    data: { user },
  } = useSuspenseQuery(orpc.workspace.list.queryOptions());

  // Scroll the the bottom when messages first load
  useEffect(() => {
    if (!hasInitialScrolled && data?.pages.length) {
      const el = scrollRef.current;

      if (el) {
        bottomRef.current?.scrollIntoView({ block: "end" });
        setHasInitialScrolled(true);
        setIsAtBottom(true);
      }
    }
  }, [hasInitialScrolled, data?.pages.length]);

  // Keep view pinned to bottom on late content growth (eg. images)

  useEffect(() => {
    const el = scrollRef.current;

    if (!el) return;

    const scrollToBottomIfNeeded = () => {
      if (isAtBottom || !hasInitialScrolled) {
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({ block: "end" });
        });
      }
    };

    const onImageLoad = (e: Event) => {
      if (e.target instanceof HTMLImageElement) {
        scrollToBottomIfNeeded();
      }
    };

    el.addEventListener("load", onImageLoad, true);

    // ResizeObserver watches for size changes in the container
    const resizeObserver = new ResizeObserver(() => {
      scrollToBottomIfNeeded();
    });

    resizeObserver.observe(el);

    // MutationObserver watches for DOM changes (e.g. images loading, content updates)
    const mutationObserver = new MutationObserver(() => {
      scrollToBottomIfNeeded();
    });

    mutationObserver.observe(el, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    return () => {
      resizeObserver.disconnect();
      el.removeEventListener("load", onImageLoad, true);
      mutationObserver.disconnect();
    };
  }, [isAtBottom, hasInitialScrolled]);

  const isNearBottom = (el: HTMLDivElement) =>
    el.scrollHeight - el.scrollTop - el.clientHeight <= 80;

  const handleScroll = () => {
    const el = scrollRef.current;

    if (!el) return;

    if (el.scrollTop <= 80 && hasNextPage && !isFetching) {
      const prevScrollHeight = el.scrollHeight;
      const prevScrollTop = el.scrollTop;

      fetchNextPage().then(() => {
        const newScrollHeight = el.scrollHeight;

        el.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop;
      });
    }

    setIsAtBottom(isNearBottom(el));
  };

  const items = useMemo(() => {
    return data?.pages.flatMap((p) => p.items) ?? [];
  }, [data]);

  const isEmpty = !isLoading && !error && items.length === 0;

  useEffect(() => {
    if (!items.length) return;

    const lastId = items[items.length - 1].id;

    const prevLastId = lastItemIdRef.current;

    const el = scrollRef.current;

    if (prevLastId && lastId !== prevLastId) {
      if (el && isNearBottom(el)) {
        requestAnimationFrame(() => {
          el.scrollTop = el.scrollHeight;
        });

        setIsAtBottom(true);
      }
    }

    lastItemIdRef.current = lastId;
  }, [items]);

  const scrollToBottom = () => {
    const el = scrollRef.current;

    if (!el) return;

    bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });

    setIsAtBottom(true);
  };

  return (
    <>
      <div className="relative h-full">
        <div
          className="h-full overflow-y-auto px-4 flex flex-col space-y-1"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {isEmpty ? (
            <div className="flex h-full pt-4">
              <EmptyState
                title="No Messages Yet"
                description="Start the conversation by sending the first message"
                buttonText="Send Message"
                href=""
              />
            </div>
          ) : (
            items?.map((msg) => (
              <MessageItem key={msg.id} message={msg} currentUserId={user.id} />
            ))
          )}

          <div ref={bottomRef}></div>
        </div>

        {isFetchingNextPage && (
          <div className="pointer-events-none absolute top-0 left-0 right-0 z-20 flex items-center justify-center py-2">
            <div className="flex items-center gap-2 rounded-md bg-linear-to-b from-white/80 to-transparent dark:from-neutral-900/80 backdrop-blur px-3 py-1">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
              <span>Loading previous messages...</span>
            </div>
          </div>
        )}

        {!isAtBottom && (
          <Button
            type="button"
            size="sm"
            onClick={scrollToBottom}
            className="absolute bottom-4 right-8 z-20 size-10 rounded-full hover:shadow-xl transition-all duration-200"
          >
            <ChevronDown className="size-4" />
          </Button>
        )}
      </div>
    </>
  );
};

export default MessageList;
