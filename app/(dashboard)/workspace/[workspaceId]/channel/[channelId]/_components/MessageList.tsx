// MessageList.tsx
"use client";

import { useInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import MessageItem from "./message/MessageItem";
import { orpc } from "@/lib/orpc";
import { useParams } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/general/EmptyState";
import { ChevronDown, Loader2 } from "lucide-react";
import MessageSkeleton from "./MessageSkeleton";
import { cn } from "@/lib/utils";
import { MessageListItem } from "@/lib/types";
import { useSearch } from "@/providers/SearchProvider";

// Constants
const SCROLL_THRESHOLD = 80;
const MESSAGES_PER_PAGE = 10;
const STALE_TIME = 30_000;
const HIGHLIGHT_DURATION = 3000; // 3 seconds
const MAX_FETCH_ATTEMPTS = 10; // Maximum pages to fetch when searching for a message

// Date Utilities
const getDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const formatDateSeparator = (date: Date): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const messageDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diffTime = today.getTime() - messageDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (messageDate.getTime() === today.getTime()) {
    return "Today";
  }

  if (messageDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }

  if (diffDays < 7 && diffDays > 0) {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
    });
  }

  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// Types
type GroupedItem =
  | { type: "separator"; dateKey: string; label: string }
  | { type: "message"; message: MessageListItem };

// Date Separator Component
const DateSeparator = memo(({ label }: { label: string }) => (
  <div
    className="relative flex items-center justify-center py-3 sm:py-4 md:py-5"
    role="separator"
    aria-label={`Messages from ${label}`}
  >
    <div className="absolute inset-x-0 top-1/2 h-px bg-border/60" />
    <span
      className={cn(
        "relative z-10",
        "px-3 sm:px-4 py-1 sm:py-1.5",
        "text-[11px] sm:text-xs font-medium",
        "text-muted-foreground",
        "bg-background",
        "rounded-full",
        "border border-border/60",
        "shadow-sm",
        "select-none"
      )}
    >
      {label}
    </span>
  </div>
));
DateSeparator.displayName = "DateSeparator";

// Loading Indicator Component
const LoadingIndicator = memo(({ isVisible }: { isVisible: boolean }) => (
  <div
    className={cn(
      "pointer-events-none absolute inset-x-0 top-0 z-20",
      "flex items-center justify-center py-2 sm:py-3",
      "transition-all duration-300 ease-out",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
    )}
  >
    <div
      className={cn(
        "flex items-center gap-1.5 sm:gap-2",
        "rounded-full",
        "bg-background/95 dark:bg-neutral-900/95",
        "backdrop-blur-md shadow-md border border-border/50",
        "px-3 sm:px-4 py-1.5 sm:py-2",
        "text-xs sm:text-sm text-muted-foreground"
      )}
    >
      <Loader2 className="size-3 sm:size-3.5 animate-spin" />
      <span className="hidden sm:inline">Loading older messages...</span>
      <span className="sm:hidden">Loading...</span>
    </div>
  </div>
));
LoadingIndicator.displayName = "LoadingIndicator";

// Searching Message Indicator
const SearchingMessageIndicator = memo(
  ({ isVisible }: { isVisible: boolean }) => (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-30",
        "flex items-center justify-center",
        "bg-background/80 backdrop-blur-sm",
        "transition-all duration-300 ease-out",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-3",
          "rounded-xl",
          "bg-background shadow-lg border",
          "px-6 py-4"
        )}
      >
        <Loader2 className="size-6 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">
          Finding message...
        </span>
      </div>
    </div>
  )
);
SearchingMessageIndicator.displayName = "SearchingMessageIndicator";

// Scroll to Bottom Button
const ScrollToBottomButton = memo(
  ({ onClick, isVisible }: { onClick: () => void; isVisible: boolean }) => (
    <div
      className={cn(
        "absolute bottom-3 sm:bottom-4 right-3 sm:right-4 md:right-6 z-20",
        "transition-all duration-300 ease-out",
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-4 scale-95 pointer-events-none"
      )}
    >
      <Button
        type="button"
        size="icon"
        variant="secondary"
        onClick={onClick}
        className={cn(
          "size-9 sm:size-10 rounded-full",
          "shadow-lg hover:shadow-xl",
          "border border-border/50",
          "transition-all duration-200",
          "hover:scale-105 active:scale-95"
        )}
      >
        <ChevronDown className="size-4 sm:size-5" />
        <span className="sr-only">Scroll to latest messages</span>
      </Button>
    </div>
  )
);
ScrollToBottomButton.displayName = "ScrollToBottomButton";

// Main Component
const MessageList = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const { navigationTarget, clearNavigationTarget } = useSearch();

  const [hasInitialScrolled, setHasInitialScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [isAtBottom, setIsAtBottom] = useState(true);
  const lastItemIdRef = useRef<string | undefined>(undefined);

  // Highlight state
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | null
  >(null);
  const [isSearchingMessage, setIsSearchingMessage] = useState(false);
  const fetchAttemptsRef = useRef(0);

  // Query configuration
  const infiniteOptions = useMemo(
    () =>
      orpc.message.list.infiniteOptions({
        input: (pageParam: string | undefined) => ({
          channelId,
          cursor: pageParam,
          limit: MESSAGES_PER_PAGE,
        }),
        queryKey: ["message.list", channelId],
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        select: (data) => ({
          pages: [...data.pages]
            .map((p) => ({
              ...p,
              items: [...p.items].reverse(),
            }))
            .reverse(),
          pageParams: [...data.pageParams].reverse(),
        }),
      }),
    [channelId]
  );

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
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  });

  const {
    data: { user },
  } = useSuspenseQuery(orpc.workspace.list.queryOptions());

  // Flatten messages
  const items = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  // Register message ref
  const registerMessageRef = useCallback(
    (id: string, el: HTMLDivElement | null) => {
      if (el) {
        messageRefs.current.set(id, el);
      } else {
        messageRefs.current.delete(id);
      }
    },
    []
  );

  // Scroll to specific message
  const scrollToMessage = useCallback((messageId: string) => {
    const messageEl = messageRefs.current.get(messageId);
    if (messageEl && scrollRef.current) {
      // Scroll to the message with some offset from top
      const container = scrollRef.current;
      const messageRect = messageEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const scrollTop =
        container.scrollTop + (messageRect.top - containerRect.top) - 100;

      container.scrollTo({
        top: Math.max(0, scrollTop),
        behavior: "smooth",
      });

      // Highlight the message
      setHighlightedMessageId(messageId);

      // Clear highlight after duration
      setTimeout(() => {
        setHighlightedMessageId(null);
      }, HIGHLIGHT_DURATION);

      return true;
    }
    return false;
  }, []);

  // Handle navigation target (from search)
  useEffect(() => {
    if (!navigationTarget || navigationTarget.channelId !== channelId) {
      return;
    }

    const targetMessageId = navigationTarget.messageId;

    // Check if message is already loaded
    const messageExists = items.some((item) => item.id === targetMessageId);

    if (messageExists) {
      // Small delay to ensure DOM is ready
      requestAnimationFrame(() => {
        scrollToMessage(targetMessageId);
        clearNavigationTarget();
        setIsSearchingMessage(false);
        fetchAttemptsRef.current = 0;
      });
    } else if (
      hasNextPage &&
      !isFetching &&
      fetchAttemptsRef.current < MAX_FETCH_ATTEMPTS
    ) {
      // Message not found, fetch more
      setIsSearchingMessage(true);
      fetchAttemptsRef.current += 1;
      fetchNextPage();
    } else if (!hasNextPage || fetchAttemptsRef.current >= MAX_FETCH_ATTEMPTS) {
      // Message not found after all attempts or no more pages
      console.warn("Message not found in channel");
      clearNavigationTarget();
      setIsSearchingMessage(false);
      fetchAttemptsRef.current = 0;
    }
  }, [
    navigationTarget,
    channelId,
    items,
    hasNextPage,
    isFetching,
    fetchNextPage,
    scrollToMessage,
    clearNavigationTarget,
  ]);

  // Group messages with date separators
  const groupedItems = useMemo((): GroupedItem[] => {
    if (items.length === 0) return [];

    const result: GroupedItem[] = [];
    let currentDateKey: string | null = null;

    for (const message of items) {
      const messageDate = new Date(message.createdAt);
      const dateKey = getDateKey(messageDate);

      if (dateKey !== currentDateKey) {
        result.push({
          type: "separator",
          dateKey,
          label: formatDateSeparator(messageDate),
        });
        currentDateKey = dateKey;
      }

      result.push({
        type: "message",
        message,
      });
    }

    return result;
  }, [items]);

  const isEmpty = !isLoading && !error && items.length === 0;

  // Check if near bottom
  const isNearBottom = useCallback(
    (el: HTMLDivElement) =>
      el.scrollHeight - el.scrollTop - el.clientHeight <= SCROLL_THRESHOLD,
    []
  );

  // Initial scroll to bottom
  useEffect(() => {
    // Don't auto-scroll if we have a navigation target
    if (navigationTarget?.channelId === channelId) {
      setHasInitialScrolled(true);
      return;
    }

    if (!hasInitialScrolled && data?.pages.length) {
      const el = scrollRef.current;
      if (el) {
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({ block: "end" });
          setHasInitialScrolled(true);
          setIsAtBottom(true);
        });
      }
    }
  }, [hasInitialScrolled, data?.pages.length, navigationTarget, channelId]);

  // Handle content changes (images, resize, mutations)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollToBottomIfNeeded = () => {
      // Don't auto-scroll if searching for a message
      if (isSearchingMessage || highlightedMessageId) return;

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

    const resizeObserver = new ResizeObserver(scrollToBottomIfNeeded);
    resizeObserver.observe(el);

    const mutationObserver = new MutationObserver(scrollToBottomIfNeeded);
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
  }, [
    isAtBottom,
    hasInitialScrolled,
    isSearchingMessage,
    highlightedMessageId,
  ]);

  // Handle scroll for infinite loading
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Fetch more when scrolled near top (but not when searching for message)
    if (
      el.scrollTop <= SCROLL_THRESHOLD &&
      hasNextPage &&
      !isFetching &&
      !isSearchingMessage
    ) {
      const prevScrollHeight = el.scrollHeight;
      const prevScrollTop = el.scrollTop;

      fetchNextPage().then(() => {
        requestAnimationFrame(() => {
          const newScrollHeight = el.scrollHeight;
          el.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop;
        });
      });
    }

    setIsAtBottom(isNearBottom(el));
  }, [
    hasNextPage,
    isFetching,
    fetchNextPage,
    isNearBottom,
    isSearchingMessage,
  ]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (!items.length || isSearchingMessage || highlightedMessageId) return;

    const lastId = items[items.length - 1].id;
    const prevLastId = lastItemIdRef.current;
    const el = scrollRef.current;

    if (prevLastId && lastId !== prevLastId && el && isNearBottom(el)) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
      setIsAtBottom(true);
    }

    lastItemIdRef.current = lastId;
  }, [items, isNearBottom, isSearchingMessage, highlightedMessageId]);

  // Scroll to bottom handler
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    setIsAtBottom(true);
  }, []);

  return (
    <div className="relative h-full">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={cn(
          "h-full overflow-y-auto scroll-smooth",
          "px-2 sm:px-3 md:px-4 py-2",
          "flex flex-col",
          "scrollbar-thin scrollbar-track-transparent",
          "scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/30"
        )}
      >
        {isLoading ? (
          <MessageSkeleton />
        ) : isEmpty ? (
          <div className="flex h-full items-center justify-center pt-2 sm:pt-4">
            <EmptyState
              title="No Messages Yet"
              description="Start the conversation by sending the first message"
              buttonText="Send Message"
              href=""
            />
          </div>
        ) : (
          <div className="flex flex-col space-y-0.5 sm:space-y-1">
            {groupedItems.map((item) =>
              item.type === "separator" ? (
                <DateSeparator key={item.dateKey} label={item.label} />
              ) : (
                <MessageItem
                  key={item.message.id}
                  message={item.message}
                  currentUserId={user.id}
                  isHighlighted={highlightedMessageId === item.message.id}
                  ref={(el) => registerMessageRef(item.message.id, el)}
                />
              )
            )}
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef} className="h-px w-full shrink-0" aria-hidden />
      </div>

      {/* Loading indicator for older messages */}
      <LoadingIndicator isVisible={isFetchingNextPage && !isSearchingMessage} />

      {/* Searching message indicator */}
      <SearchingMessageIndicator isVisible={isSearchingMessage} />

      {/* Scroll to bottom button */}
      <ScrollToBottomButton
        onClick={scrollToBottom}
        isVisible={!isAtBottom && hasInitialScrolled && !isSearchingMessage}
      />
    </div>
  );
};

export default MessageList;
