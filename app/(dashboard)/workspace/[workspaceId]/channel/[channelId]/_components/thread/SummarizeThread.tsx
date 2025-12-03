import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sparkles } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { eventIteratorToStream } from "@orpc/server";
import { client } from "@/lib/orpc";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { MessageResponse } from "@/components/ai-elements/message";

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
        return eventIteratorToStream(
          await client.ai.thread.summary.generate(
            {
              messageId: messageId,
            },
            { signal: options.abortSignal }
          )
        );
      },
      reconnectToStream() {
        throw new Error("Unsupported");
      },
    },
  });

  const lastAssistant = messages.findLast((m) => m.role === "assistant");

  const summaryText =
    lastAssistant?.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("\n\n") ?? "";

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      const hasAssistantMessage = messages.some((m) => m.role === "assistant");

      if (status !== "ready" || hasAssistantMessage) {
        return;
      }

      sendMessage({ text: "Summarize Thread" });
    } else {
      stop();
      clearError();

      setMessages([]);
    }
  }

  return (
    <>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button type="button" size={"sm"}>
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-3.5" />
              <span className="text-xs">Summarize</span>
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-100 p-0" align="end">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <span className="relative inline-flex items-center justify-center rounded-full bg-linear-to-r from-accent to-bg-secondary border px-4 py-2 gap-1.5">
                <Sparkles className="size-3.5" />
                <span className="text-sm">AI Summary (Preview)</span>
              </span>
            </div>
            {status === "streaming" && (
              <Button
                onClick={() => stop()}
                type="button"
                size={"sm"}
                variant={"outline"}
              >
                Stop
              </Button>
            )}
          </div>

          <div className="px-4 py-3 max-h-80 overflow-y-auto">
            {error ? (
              <div>
                <p className="text-destructive">{error.message}</p>
                <Button
                  type="button"
                  size={"sm"}
                  onClick={() => {
                    clearError();
                    setMessages([]);
                    sendMessage({ text: "Summarize Thread" });
                  }}
                >
                  Try Again
                </Button>
              </div>
            ) : summaryText ? (
              <MessageResponse parseIncompleteMarkdown={status !== "ready"}>
                {summaryText}
              </MessageResponse>
            ) : status === "submitted" || status === "streaming" ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Click summarize to generate
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default SummarizeThread;
