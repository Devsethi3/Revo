"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearch } from "@/providers/SearchProvider";
import { useDebounce } from "@/hooks/use-debounce";
import { useInfiniteQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  X,
  Loader2,
  Hash,
  MessageSquare,
  ArrowRight,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { getAvatar } from "@/lib/get-avatar";
import { SafeContent } from "@/components/rich-text-editor/SafeContent";
import { useRouter, useParams } from "next/navigation";
import { useThread } from "@/providers/ThreadProvider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const SEARCH_DEBOUNCE_MS = 300;
const SEARCH_LIMIT = 20;
const MIN_SEARCH_LENGTH = 2;

// Format relative time
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(new Date(date));
};

interface SearchResultItemProps {
  result: {
    id: string;
    content: string;
    authorName: string;
    authorAvatar: string;
    authorEmail: string;
    createdAt: Date;
    channelId: string | null;
    channelName: string;
    threadId: string | null;
    replyCount: number;
  };
  onNavigate: (
    messageId: string,
    channelId: string,
    threadId?: string | null
  ) => void;
  isCurrentChannel: boolean;
  isSelected: boolean;
}

const SearchResultItem = ({
  result,
  onNavigate,
  isCurrentChannel,
  isSelected,
}: SearchResultItemProps) => {
  const handleClick = useCallback(() => {
    if (result.channelId) {
      onNavigate(result.id, result.channelId, result.threadId);
    }
  }, [result, onNavigate]);

  const highlightedContent = useMemo(() => {
    try {
      return JSON.parse(result.content);
    } catch {
      return result.content;
    }
  }, [result.content]);

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full text-left p-2.5 sm:p-3 rounded-xl",
        "transition-all duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        "group relative",
        isSelected
          ? "bg-primary/10 ring-1 ring-primary/20"
          : "hover:bg-muted/60 active:bg-muted/80"
      )}
    >
      <div className="flex gap-2.5 sm:gap-3">
        <Avatar className="size-8">
          <Image
            src={getAvatar(result.authorAvatar, result.authorEmail)}
            alt={result.authorName}
            fill
            unoptimized
            className="size-8 sm:size-10 shrink-0 ring-2 ring-background"
          />
          <AvatarFallback className="bg-linear-to-br from-emerald-700 via-emerald-800 to-indigo-700 font-semibold text-white size-8 sm:size-10 rounded-md">
            {result.authorName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start sm:items-center justify-between gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 min-w-0">
              <span className="font-semibold text-sm truncate max-w-[150px] sm:max-w-none">
                {result.authorName}
              </span>

              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs",
                  "px-1.5 py-0.5 rounded-md",
                  isCurrentChannel
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Hash className="size-3" />
                <span className="truncate max-w-20 sm:max-w-[120px]">
                  {result.channelName}
                </span>
              </span>
            </div>

            <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0 flex items-center gap-1">
              <Clock className="size-3 hidden sm:inline" />
              {formatRelativeTime(result.createdAt)}
            </span>
          </div>

          <div className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            <SafeContent
              content={highlightedContent}
              className="prose-sm dark:prose-invert max-w-none **:text-muted-foreground **:text-sm"
            />
          </div>

          {result.threadId && (
            <div className="inline-flex items-center gap-1.5 text-xs text-primary/80 bg-primary/5 px-2 py-1 rounded-full">
              <MessageSquare className="size-3" />
              <span>Reply in thread</span>
            </div>
          )}
        </div>

        <div
          className={cn(
            "flex items-center justify-center",
            "size-8 rounded-full shrink-0",
            "bg-transparent group-hover:bg-primary/10",
            "transition-all duration-150",
            "opacity-0 group-hover:opacity-100 group-focus:opacity-100"
          )}
        >
          <ArrowRight className="size-4 text-primary" />
        </div>
      </div>
    </button>
  );
};

const EmptySearchState = ({ query }: { query: string }) => (
  <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 text-center">
    <div className="size-14 sm:size-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
      <Search className="size-6 sm:size-7 text-muted-foreground/60" />
    </div>
    <h3 className="font-semibold text-base sm:text-lg mb-1">
      No results found
    </h3>
    <p className="text-sm text-muted-foreground max-w-[280px]">
      No messages match &ldquo;
      <span className="font-medium text-foreground">{query}</span>
      &rdquo;. Try different keywords.
    </p>
  </div>
);

const InitialSearchState = () => (
  <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 text-center">
    <div className="size-14 sm:size-16 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
      <Search className="size-6 sm:size-7 text-primary" />
    </div>
    <h3 className="font-semibold text-base sm:text-lg mb-1">Search messages</h3>
    <p className="text-sm text-muted-foreground max-w-[280px]">
      Type at least {MIN_SEARCH_LENGTH} characters to search through your
      messages
    </p>
  </div>
);

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-12 gap-3">
    <div className="relative">
      <div className="size-10 rounded-full border-2 border-muted" />
      <Loader2 className="size-10 animate-spin text-primary absolute inset-0" />
    </div>
    <p className="text-sm text-muted-foreground">Searching messages...</p>
  </div>
);

export function SearchDialog() {
  const {
    isOpen,
    closeSearch,
    currentChannelId,
    searchQuery,
    setSearchQuery,
    clearSearch,
    setNavigationTarget,
  } = useSearch();

  const router = useRouter();
  const params = useParams<{ workspaceId: string; channelId: string }>();
  const { openThread } = useThread();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchInChannel, setSearchInChannel] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const debouncedQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);
  const shouldSearch = debouncedQuery.length >= MIN_SEARCH_LENGTH;

  const searchOptions = useMemo(
    () =>
      orpc.message.search.infiniteOptions({
        input: (pageParam: string | undefined) => ({
          query: debouncedQuery,
          channelId: searchInChannel ? currentChannelId : undefined,
          cursor: pageParam,
          limit: SEARCH_LIMIT,
        }),
        queryKey: [
          "message.search",
          debouncedQuery,
          searchInChannel ? currentChannelId : "all",
        ],
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }),
    [debouncedQuery, currentChannelId, searchInChannel]
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    ...searchOptions,
    enabled: shouldSearch && isOpen,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

  const results = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  const totalCount = data?.pages[0]?.totalCount ?? 0;

  // Clamp selected index to valid bounds (safe to compute during render)
  const clampedSelectedIndex = useMemo(() => {
    if (results.length === 0) return 0;
    return Math.min(selectedIndex, results.length - 1);
  }, [selectedIndex, results.length]);

  // Reset selected index when search parameters change (triggers new results)
  useEffect(() => {
    queueMicrotask(() => {
      setSelectedIndex(0);
    });
  }, [debouncedQuery, searchInChannel]);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 100;

    if (nearBottom && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetching, fetchNextPage]);

  const handleNavigate = useCallback(
    (messageId: string, channelId: string, threadId?: string | null) => {
      const isCurrentChannel = channelId === params.channelId;

      setNavigationTarget({
        messageId,
        channelId,
        threadId,
      });

      if (threadId) {
        if (!isCurrentChannel) {
          router.push(`/workspace/${params.workspaceId}/channel/${channelId}`);
          sessionStorage.setItem("pendingThreadId", threadId);
          sessionStorage.setItem("pendingMessageId", messageId);
        } else {
          openThread(threadId);
        }
      } else if (!isCurrentChannel) {
        router.push(`/workspace/${params.workspaceId}/channel/${channelId}`);
      }

      closeSearch();
    },
    [
      router,
      params.workspaceId,
      params.channelId,
      closeSearch,
      setNavigationTarget,
      openThread,
    ]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          closeSearch();
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          const selectedResult = results[clampedSelectedIndex];
          if (selectedResult?.channelId) {
            handleNavigate(
              selectedResult.id,
              selectedResult.channelId,
              selectedResult.threadId
            );
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeSearch, results, clampedSelectedIndex, handleNavigate]);

  // Scroll selected item into view
  useEffect(() => {
    if (results.length > 0 && scrollRef.current) {
      const selectedElement = scrollRef.current.querySelector(
        `[data-index="${clampedSelectedIndex}"]`
      );
      selectedElement?.scrollIntoView({ block: "nearest" });
    }
  }, [clampedSelectedIndex, results.length]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeSearch()}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "p-0 gap-0 overflow-hidden",
          "w-[calc(100vw-2rem)] sm:w-full",
          "max-w-[95vw] sm:max-w-[600px]",
          "max-h-[85vh] sm:max-h-[80vh]",
          "flex flex-col",
          "rounded-2xl"
        )}
      >
        <DialogHeader className="p-3 sm:p-4 pb-0 space-y-3">
          <DialogTitle className="sr-only">Search Messages</DialogTitle>

          <div className="relative">
            <div
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2",
                "flex items-center justify-center",
                isFetching && shouldSearch
                  ? "animate-pulse"
                  : "text-muted-foreground"
              )}
            >
              {isFetching && shouldSearch ? (
                <Loader2 className="size-4 sm:size-5 animate-spin text-primary" />
              ) : (
                <Search className="size-4 sm:size-5" />
              )}
            </div>
            <Input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className={cn(
                "pl-10 sm:pl-11 pr-10 sm:pr-11",
                "h-11 sm:h-12",
                "text-base",
                "rounded-xl",
                "border-muted-foreground/20",
                "focus-visible:ring-primary/20 focus-visible:ring-offset-0",
                "placeholder:text-muted-foreground/60"
              )}
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                className={cn(
                  "absolute right-1 top-1/2 -translate-y-1/2",
                  "size-8 sm:size-9",
                  "rounded-lg",
                  "hover:bg-muted"
                )}
              >
                <X className="size-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>

          {currentChannelId && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSearchInChannel(true)}
                className={cn(
                  "h-8 sm:h-9 px-3 text-xs sm:text-sm rounded-lg",
                  "transition-all duration-150",
                  searchInChannel
                    ? "bg-primary/10 text-primary hover:bg-primary/15"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Hash className="size-3 sm:size-3.5 mr-1.5" />
                <span className="hidden xs:inline">Current</span> channel
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSearchInChannel(false)}
                className={cn(
                  "h-8 sm:h-9 px-3 text-xs sm:text-sm rounded-lg",
                  "transition-all duration-150",
                  !searchInChannel
                    ? "bg-primary/10 text-primary hover:bg-primary/15"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                All channels
              </Button>
            </div>
          )}
        </DialogHeader>

        <div className="h-px bg-border mx-3 sm:mx-4 mt-3" />

        <div className="flex-1 min-h-0 overflow-hidden">
          {!shouldSearch ? (
            <InitialSearchState />
          ) : isLoading ? (
            <LoadingState />
          ) : results.length === 0 ? (
            <EmptySearchState query={debouncedQuery} />
          ) : (
            <div className="h-full flex flex-col">
              <div className="px-3 sm:px-4 py-2 flex items-center justify-between">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {totalCount}
                  </span>{" "}
                  {totalCount === 1 ? "result" : "results"} found
                </span>
                {searchInChannel && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Hash className="size-3" />
                    <span className="hidden sm:inline">in current channel</span>
                  </span>
                )}
              </div>

              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className={cn(
                  "flex-1 overflow-y-auto",
                  "px-2 sm:px-3 pb-2",
                  "scrollbar-thin scrollbar-track-transparent",
                  "scrollbar-thumb-muted-foreground/20"
                )}
              >
                <div className="space-y-1">
                  {results.map((result, index) => (
                    <div key={result.id} data-index={index}>
                      <SearchResultItem
                        result={result}
                        onNavigate={handleNavigate}
                        isCurrentChannel={result.channelId === params.channelId}
                        isSelected={index === clampedSelectedIndex}
                      />
                    </div>
                  ))}

                  {isFetchingNextPage && (
                    <div className="flex items-center justify-center py-4 gap-2">
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Loading more...
                      </span>
                    </div>
                  )}

                  {!hasNextPage && results.length > 0 && (
                    <div className="text-center py-4">
                      <span className="text-xs text-muted-foreground px-3 py-1.5 bg-muted/50 rounded-full">
                        End of results
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className={cn(
            "border-t px-3 sm:px-4 py-2 sm:py-2.5",
            "flex items-center justify-between",
            "bg-muted/30"
          )}
        >
          <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
            <span className="hidden sm:flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono border border-border/50">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono border border-border/50">
                ↓
              </kbd>
              <span className="text-muted-foreground/70">navigate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono border border-border/50">
                ↵
              </kbd>
              <span className="text-muted-foreground/70">select</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono border border-border/50">
                esc
              </kbd>
              <span className="text-muted-foreground/70">close</span>
            </span>
          </div>

          <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono border border-border/50">
              ⌘
            </kbd>
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono border border-border/50">
              K
            </kbd>
            <span className="text-muted-foreground/70">toggle</span>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
