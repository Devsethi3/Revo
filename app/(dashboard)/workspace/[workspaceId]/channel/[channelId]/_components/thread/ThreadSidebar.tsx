"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, MessageSquare, X } from "lucide-react";
import Image from "next/image";
import ThreadReply from "./ThreadReply";
import ThreadReplyForm from "./ThreadReplyForm";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { SafeContent } from "@/components/rich-text-editor/SafeContent";
import { useThread } from "@/providers/ThreadProvider";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import ThreadSidebarSkeleton from "./ThreadbarSidebarSkeleton";
import { useEffect, useRef, useState } from "react";
import SummarizeThread from "./SummarizeThread";
import { ThreadRealtimeProvider } from "@/providers/ThreadRealtimeProvider";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ThreadSidebarProps {
  user: KindeUser<Record<string, unknown>>;
}

const ThreadSidebar = ({ user }: ThreadSidebarProps) => {
  const { selectedThreadId, closeThread } = useThread();

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const lastMessageCountRef = useRef<number>(0);

  const { data, isLoading, isError, error } = useQuery(
    orpc.message.thread.list.queryOptions({
      input: {
        messageId: selectedThreadId!,
      },
      enabled: Boolean(selectedThreadId),
    })
  );

  const messageCount = data?.messages.length ?? 0;

  const isNearBottom = (el: HTMLDivElement) =>
    el.scrollHeight - el.scrollTop - el.clientHeight <= 80;

  const handleScroll = () => {
    const el = scrollRef.current;

    if (!el) return;

    setIsAtBottom(isNearBottom(el));
  };

  useEffect(() => {
    if (messageCount === 0) return;

    const prevMessageCount = lastMessageCountRef.current;
    const el = scrollRef.current;

    if (prevMessageCount > 0 && messageCount !== prevMessageCount) {
      if (el && isNearBottom(el)) {
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        });

        setIsAtBottom(true);
      }
    }

    lastMessageCountRef.current = messageCount;
  }, [messageCount]);

  // Keep view pinned to bottom on late content growth (eg. images)

  useEffect(() => {
    const el = scrollRef.current;

    if (!el) return;

    const scrollToBottomIfNeeded = () => {
      if (isAtBottom) {
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
  }, [isAtBottom]);

  // Show skeleton while loading
  if (isLoading) {
    return <ThreadSidebarSkeleton />;
  }

  const scrollToBottom = () => {
    const el = scrollRef.current;

    if (!el) return;

    bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });

    setIsAtBottom(true);
  };

  return (
    <ThreadRealtimeProvider threadId={selectedThreadId!}>
      <div className="w-120 border-l flex flex-col h-full">
        {/* Header */}
        <div className="border-b h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-4" />
            <span className="font-medium">Thread</span>
          </div>

          <div className="flex items-center gap-2">
            <SummarizeThread messageId={selectedThreadId!} />
            <Button onClick={closeThread} variant="outline" size="icon">
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <ScrollArea className="flex-1 overflow-y-auto relative">
          {/* Error State */}
          {isError && (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-2 px-4 text-center">
                <p className="text-sm font-medium text-destructive">
                  Failed to load thread
                </p>
                <p className="text-xs text-muted-foreground">
                  {error?.message || "An unexpected error occurred"}
                </p>
              </div>
            </div>
          )}

          {/* Content - Only render when data is available */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="h-full overflow-y-auto"
          >
            {data && (
              <>
                {/* Parent Message */}
                <div className="p-4 border-b bg-muted/20">
                  <div className="flex space-x-3">
                    <Image
                      src={data.parent.authorAvatar}
                      alt={`${data.parent.authorName}'s avatar`}
                      width={32}
                      height={32}
                      className="size-8 rounded-full shrink-0"
                    />
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">
                          {data.parent.authorName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Intl.DateTimeFormat("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                            month: "short",
                            day: "numeric",
                          }).format(new Date(data.parent.createdAt))}
                        </span>
                      </div>
                      <SafeContent
                        content={JSON.parse(data.parent.content)}
                        className="text-sm wrap-break-word prose dark:prose-invert max-w-none"
                      />
                      {data.parent.imageUrl && (
                        <div className="mt-2">
                          <Image
                            src={data.parent.imageUrl}
                            alt="Message attachment"
                            width={400}
                            height={300}
                            className="rounded-lg border max-w-full h-auto"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Thread Replies */}
                <div className="p-2">
                  <div className="p-2">
                    {data.messages.length > 0 && (
                      <p className="text-xs text-muted-foreground mb-3 px-2">
                        {data.messages.length}{" "}
                        {data.messages.length === 1 ? "reply" : "replies"}
                      </p>
                    )}
                  </div>

                  {data.messages.length > 0 ? (
                    <div className="space-y-1">
                      {data.messages.map((reply) => (
                        <ThreadReply
                          message={reply}
                          key={reply.id}
                          selectedThreadId={selectedThreadId!}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-sm text-muted-foreground">
                        No replies yet. Be the first to reply!
                      </p>
                    </div>
                  )}
                </div>
                <div ref={bottomRef}></div>
              </>
            )}
          </div>

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
        </ScrollArea>

        {/* Thread Reply Input - Only show when thread is selected */}
        {selectedThreadId && (
          <div className="border-t p-4">
            <ThreadReplyForm threadId={selectedThreadId} user={user} />
          </div>
        )}
      </div>
    </ThreadRealtimeProvider>
  );
};

export default ThreadSidebar;
