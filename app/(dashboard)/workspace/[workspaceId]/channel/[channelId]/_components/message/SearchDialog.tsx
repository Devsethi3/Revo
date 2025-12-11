// components/search/SearchDialog.tsx
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  X,
  Loader2,
  Hash,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { getAvatar } from "@/lib/get-avatar";
import { SafeContent } from "@/components/rich-text-editor/SafeContent";
import { useRouter, useParams } from "next/navigation";

const SEARCH_DEBOUNCE_MS = 300;
const SEARCH_LIMIT = 20;
const MIN_SEARCH_LENGTH = 2;

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
  query: string;
  onNavigate: (channelId: string, threadId?: string | null) => void;
}

const SearchResultItem = ({
  result,
  query,
  onNavigate,
}: SearchResultItemProps) => {
  const handleClick = useCallback(() => {
    if (result.channelId) {
      onNavigate(result.channelId, result.threadId);
    }
  }, [result, onNavigate]);

  // Parse content for preview
  const highlightedContent = useMemo(() => {
    try {
      const parsed = JSON.parse(result.content);
      return parsed;
    } catch {
      return result.content;
    }
  }, [result.content]);

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full text-left p-3 rounded-lg",
        "hover:bg-muted/60 focus:bg-muted/60",
        "transition-colors duration-150",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
        "group"
      )}
    >
      <div className="flex gap-3">
        {/* Author Avatar */}
        <Image
          src={getAvatar(result.authorAvatar, result.authorEmail)}
          alt={result.authorName}
          width={36}
          height={36}
          className="size-9 rounded-lg shrink-0"
        />

        <div className="flex-1 min-w-0 space-y-1">
          {/* Header: Author, Channel, Time */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium truncate">{result.authorName}</span>
            <span className="text-muted-foreground">in</span>
            <span className="inline-flex items-center gap-0.5 text-muted-foreground">
              <Hash className="size-3" />
              <span className="truncate max-w-[120px]">
                {result.channelName}
              </span>
            </span>
            <span className="text-muted-foreground text-xs ml-auto shrink-0">
              {new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(result.createdAt))}
            </span>
          </div>

          {/* Message Content Preview */}
          <div className="text-sm text-muted-foreground line-clamp-2">
            <SafeContent
              content={highlightedContent}
              className="prose-sm dark:prose-invert max-w-none **:text-muted-foreground!"
            />
          </div>

          {/* Thread indicator */}
          {result.threadId && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageSquare className="size-3" />
              <span>Reply in thread</span>
            </div>
          )}
        </div>

        {/* Navigate arrow */}
        <ArrowRight
          className={cn(
            "size-4 text-muted-foreground shrink-0 mt-1",
            "opacity-0 group-hover:opacity-100 transition-opacity"
          )}
        />
      </div>
    </button>
  );
};

const EmptySearchState = ({ query }: { query: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
      <Search className="size-6 text-muted-foreground" />
    </div>
    <h3 className="font-medium text-base mb-1">No results found</h3>
    <p className="text-sm text-muted-foreground max-w-[250px]">
      No messages match &quot;{query}&quot;. Try different keywords.
    </p>
  </div>
);

const InitialSearchState = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
      <Search className="size-6 text-muted-foreground" />
    </div>
    <h3 className="font-medium text-base mb-1">Search messages</h3>
    <p className="text-sm text-muted-foreground max-w-[250px]">
      Type at least {MIN_SEARCH_LENGTH} characters to search through messages
    </p>
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
  } = useSearch();

  const router = useRouter();
  const params = useParams<{ workspaceId: string }>();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchInChannel, setSearchInChannel] = useState(true);

  const debouncedQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);
  const shouldSearch = debouncedQuery.length >= MIN_SEARCH_LENGTH;

  // Search query configuration
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

  // Flatten results
  const results = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  const totalCount = data?.pages[0]?.totalCount ?? 0;

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle scroll for infinite loading
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 100;

    if (nearBottom && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetching, fetchNextPage]);

  // Keyboard shortcut to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeSearch]);

  // Navigate to message - handles thread opening via URL or custom event
  const handleNavigate = useCallback(
    (channelId: string, threadId?: string | null) => {
      // Navigate to the channel
      router.push(`/workspace/${params.workspaceId}/channel/${channelId}`);

      // If it's a thread reply, dispatch a custom event to open the thread
      // This will be caught by the ThreadProvider after navigation
      if (threadId) {
        // Store thread ID to open after navigation
        sessionStorage.setItem("pendingThreadId", threadId);
      }

      closeSearch();
    },
    [router, params.workspaceId, closeSearch]
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeSearch()}>
      <DialogContent className="sm:max-w-[600px] p-0 pt-10 gap-0 max-h-[80vh] flex flex-col">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="sr-only">Search Messages</DialogTitle>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="pl-10 pr-10 h-11"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 size-8"
              >
                <X className="size-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>

          {/* Search scope toggle */}
          {currentChannelId && (
            <div className="flex items-center gap-2 pt-3">
              <Button
                type="button"
                variant={searchInChannel ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSearchInChannel(true)}
                className="h-7 text-xs"
              >
                <Hash className="size-3 mr-1" />
                Current channel
              </Button>
              <Button
                type="button"
                variant={!searchInChannel ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSearchInChannel(false)}
                className="h-7 text-xs"
              >
                All channels
              </Button>
            </div>
          )}
        </DialogHeader>

        {/* Results area */}
        <div className="flex-1 min-h-0 border-t mt-3">
          {!shouldSearch ? (
            <InitialSearchState />
          ) : isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : results.length === 0 ? (
            <EmptySearchState query={debouncedQuery} />
          ) : (
            <>
              {/* Results count */}
              <div className="px-4 py-2 text-xs text-muted-foreground border-b">
                {totalCount} {totalCount === 1 ? "result" : "results"} found
              </div>

              {/* Scrollable results */}
              <ScrollArea className="h-[400px]">
                <div
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="p-2 space-y-1 h-full overflow-y-auto"
                >
                  {results.map((result) => (
                    <SearchResultItem
                      key={result.id}
                      result={result}
                      query={debouncedQuery}
                      onNavigate={handleNavigate}
                    />
                  ))}

                  {/* Load more indicator */}
                  {isFetchingNextPage && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    </div>
                  )}

                  {/* End of results */}
                  {!hasNextPage && results.length > 0 && (
                    <div className="text-center py-4 text-xs text-muted-foreground">
                      End of results
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </div>

        {/* Footer with keyboard hints */}
        <div className="border-t p-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
                ↵
              </kbd>
              <span>to select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
                esc
              </kbd>
              <span>to close</span>
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
              ⌘
            </kbd>
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
              K
            </kbd>
            <span>to toggle</span>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
