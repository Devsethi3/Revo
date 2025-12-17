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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
      }
    }

    lastMessageCountRef.current = messageCount;
  }, [messageCount]);

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

    const resizeObserver = new ResizeObserver(() => {
      scrollToBottomIfNeeded();
    });

    resizeObserver.observe(el);

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
      <div className="w-full h-full flex flex-col bg-background">
        {/* Header */}
        <div className="border-b h-12 sm:h-14 px-2 sm:px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex items-center justify-center size-8 sm:size-9 rounded-lg bg-primary/10 text-primary">
              <MessageSquare className="size-4 sm:size-[18px]" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm sm:text-base tracking-tight">
                Thread
              </span>
              {data && (
                <span className="text-[10px] sm:text-xs text-muted-foreground">
                  {data.messages.length}{" "}
                  {data.messages.length === 1 ? "reply" : "replies"}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <SummarizeThread messageId={selectedThreadId!} />
            <Button
              onClick={closeThread}
              variant="outline"
              size="icon"
              className="size-8 sm:size-9"
            >
              <X className="size-4" />
              <span className="sr-only">Close thread</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-0 relative">
          {/* Error State */}
          {isError && (
            <div className="flex items-center justify-center h-full p-4">
              <div className="flex flex-col items-center gap-2 text-center max-w-xs">
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
            className="h-full scroll-smooth overflow-y-auto"
          >
            {data && (
              <>
                {/* Parent Message */}
                <div className="p-3 sm:p-4 border-b bg-muted/20">
                  <div className="flex gap-2 sm:gap-3">
                    <Avatar className="relative size-8 rounded-lg">
                      <Image
                        src={data.parent.authorAvatar}
                        alt={`${data.parent.authorName}'s avatar`}
                        className="size-7 sm:size-8 rounded-lg shrink-0"
                        unoptimized
                        fill
                      />
                      <AvatarFallback className="bg-linear-to-br from-emerald-700 via-emerald-800 to-indigo-700 font-semibold text-white">
                        {data.parent.authorName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="font-medium text-xs sm:text-sm">
                          {data.parent.authorName}
                        </span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground">
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
                        className="text-xs sm:text-sm wrap-break-word prose prose-sm dark:prose-invert max-w-none"
                      />
                      {data.parent.imageUrl && (
                        <div className="mt-2">
                          <Image
                            src={data.parent.imageUrl}
                            alt="Message attachment"
                            width={400}
                            height={300}
                            className="rounded-lg border max-w-full h-auto max-h-40 sm:max-h-52 md:max-h-64 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Thread Replies */}
                <div className="p-2 sm:p-3">
                  <div className="px-1 sm:px-2 mb-2 sm:mb-3">
                    {data.messages.length > 0 && (
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        {data.messages.length}{" "}
                        {data.messages.length === 1 ? "reply" : "replies"}
                      </p>
                    )}
                  </div>

                  {data.messages.length > 0 ? (
                    <div className="space-y-0.5 sm:space-y-1">
                      {data.messages.map((reply) => (
                        <ThreadReply
                          message={reply}
                          key={reply.id}
                          selectedThreadId={selectedThreadId!}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-6 sm:py-8 px-4">
                      <p className="text-xs sm:text-sm text-muted-foreground text-center">
                        No replies yet. Be the first to reply!
                      </p>
                    </div>
                  )}
                </div>
                <div ref={bottomRef}></div>
              </>
            )}
          </div>

          {/* Scroll to bottom button */}
          {!isAtBottom && (
            <Button
              type="button"
              size="icon"
              onClick={scrollToBottom}
              className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 z-20 size-8 sm:size-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <ChevronDown className="size-4" />
              <span className="sr-only">Scroll to bottom</span>
            </Button>
          )}
        </div>

        {/* Thread Reply Input */}
        {selectedThreadId && (
          <div className="border-t p-2 sm:p-3 md:p-4 shrink-0">
            <ThreadReplyForm threadId={selectedThreadId} user={user} />
          </div>
        )}
      </div>
    </ThreadRealtimeProvider>
  );
};

export default ThreadSidebar;
