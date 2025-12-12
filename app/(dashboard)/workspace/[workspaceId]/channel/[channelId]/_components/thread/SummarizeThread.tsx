import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sparkles, AlertCircle } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { eventIteratorToStream } from "@orpc/server";
import { client } from "@/lib/orpc";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useCallback, useMemo } from "react";
import { MessageResponse } from "@/components/ai-elements/message";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SummarizeThreadProps {
  messageId: string;
}

const SummarizeThread = ({ messageId }: SummarizeThreadProps) => {
  const [open, setOpen] = useState(false);

  const {
    messages,
    status,
    error,
    sendMessage,
    setMessages,
    stop,
    clearError,
  } = useChat({
    id: `thread-summary:${messageId}`,
    transport: {
      async sendMessages(options) {
        try {
          return eventIteratorToStream(
            await client.ai.thread.summary.generate(
              { messageId },
              { signal: options.abortSignal }
            )
          );
        } catch (err) {
          console.error("Summary generation error:", err);
          throw err;
        }
      },
      reconnectToStream() {
        throw new Error("Unsupported");
      },
    },
  });

  // Memoize summary text extraction
  const summaryText = useMemo(() => {
    const lastAssistant = messages.findLast((m) => m.role === "assistant");
    return (
      lastAssistant?.parts
        .filter((p) => p.type === "text")
        .map((p) => p.text)
        .join("\n\n") ?? ""
    );
  }, [messages]);

  // Determine if we're loading
  const isLoading = status === "submitted" || status === "streaming";
  const isReady = status === "ready";

  // Get user-friendly error message
  const errorMessage = useMemo(() => {
    if (!error) return null;

    // Network errors
    if (error.message.includes("fetch") || error.message.includes("network")) {
      return "Unable to connect. Please check your internet connection.";
    }

    // Timeout errors
    if (
      error.message.includes("timeout") ||
      error.message.includes("aborted")
    ) {
      return "Request timed out. Please try again.";
    }

    // Rate limit errors
    if (error.message.includes("rate limit") || error.message.includes("429")) {
      return "Too many requests. Please wait a moment and try again.";
    }

    // Server errors
    if (error.message.includes("500") || error.message.includes("server")) {
      return "Server error. Please try again later.";
    }

    // Authentication errors
    if (error.message.includes("401") || error.message.includes("403")) {
      return "Authentication error. Please refresh and try again.";
    }

    // Generic fallback
    return "Unable to generate summary. Please try again.";
  }, [error]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);

      if (nextOpen) {
        const hasAssistantMessage = messages.some(
          (m) => m.role === "assistant"
        );

        if (!isReady || hasAssistantMessage) {
          return;
        }

        sendMessage({ text: "Summarize Thread" });
      } else {
        stop();
        clearError();
        setMessages([]);
      }
    },
    [isReady, messages, sendMessage, stop, clearError, setMessages]
  );

  const handleRetry = useCallback(() => {
    clearError();
    setMessages([]);
    sendMessage({ text: "Summarize Thread" });
  }, [clearError, setMessages, sendMessage]);

  const handleStop = useCallback(() => {
    stop();
  }, [stop]);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button type="button" size="sm" className="gap-1.5">
          <Sparkles className="size-3 sm:size-3.5" />
          <span className="text-xs sm:text-sm">Summarize</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          "w-[calc(100vw-2rem)] sm:w-[400px] md:w-[480px] lg:w-[520px]",
          "p-0"
        )}
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={cn(
                "inline-flex items-center justify-center",
                "rounded-full border",
                "bg-linear-to-r from-accent/50 to-secondary/50",
                "px-2.5 sm:px-3 py-1 sm:py-1.5",
                "gap-1 sm:gap-1.5",
                "shrink-0"
              )}
            >
              <Sparkles className="size-3 sm:size-3.5 shrink-0" />
              <span className="text-[11px] sm:text-xs font-medium whitespace-nowrap">
                AI Summary
              </span>
            </span>
            <span className="hidden sm:inline text-xs text-muted-foreground">
              (Preview)
            </span>
          </div>

          {status === "streaming" && (
            <Button
              onClick={handleStop}
              type="button"
              size="sm"
              variant="outline"
              className="text-xs h-7 px-2 sm:px-3"
            >
              Stop
            </Button>
          )}
        </div>

        {/* Content Area */}
        <ScrollArea
          className={cn(
            "h-[250px] sm:h-[300px] md:h-[350px]",
            "border-t-0 px-3 sm:px-4",
            "rounded-b-md rounded-t-none"
          )}
        >
          {error ? (
            <div className="space-y-3">
              <Alert variant="destructive" className="border-destructive/50">
                <AlertCircle className="size-4" />
                <AlertDescription className="text-sm">
                  {errorMessage}
                </AlertDescription>
              </Alert>

              <Button
                type="button"
                size="sm"
                onClick={handleRetry}
                className="w-full sm:w-auto"
              >
                Try Again
              </Button>
            </div>
          ) : summaryText ? (
            <div className="prose prose-sm mt-3 sm:prose-base dark:prose-invert max-w-none">
              <MessageResponse parseIncompleteMarkdown={!isReady}>
                {summaryText}
              </MessageResponse>
            </div>
          ) : isLoading ? (
            <div className="space-y-3 sm:space-y-4 mt-3">
              <div className="space-y-2">
                <Skeleton className="h-3 sm:h-4 w-full" />
                <Skeleton className="h-3 sm:h-4 w-11/12" />
                <Skeleton className="h-3 sm:h-4 w-10/12" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 sm:h-4 w-full" />
                <Skeleton className="h-3 sm:h-4 w-9/12" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 sm:h-4 w-11/12" />
                <Skeleton className="h-3 sm:h-4 w-full" />
                <Skeleton className="h-3 sm:h-4 w-8/12" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <Sparkles className="size-8 sm:size-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm sm:text-base text-muted-foreground">
                Click Summarize to generate an AI summary of this thread
              </p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default SummarizeThread;
