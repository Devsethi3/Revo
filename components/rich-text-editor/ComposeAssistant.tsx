import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { eventIteratorToStream } from "@orpc/server";
import { client } from "@/lib/orpc";
import { MessageResponse } from "../ai-elements/message";
import { Skeleton } from "../ui/skeleton";

interface ComposeAssistantProps {
  content: string;
  onAccept?: (markdown: string) => void;
}

const ComposeAssistant = ({ content, onAccept }: ComposeAssistantProps) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(content);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  const {
    messages,
    status,
    error,
    sendMessage,
    setMessages,
    stop,
    clearError,
  } = useChat({
    id: `compose-assistant`,
    transport: {
      async sendMessages(options) {
        return eventIteratorToStream(
          await client.ai.compose.generate(
            { content: contentRef.current },
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

  const composeText =
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

      sendMessage({ text: "Rewrite" });
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
              <span className="text-xs">Compose</span>
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 sm:w-96 md:w-[420px] p-0" align="end">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <span className="relative inline-flex items-center justify-center rounded-full bg-linear-to-r from-accent to-bg-secondary border px-4 py-2 gap-1.5">
                <Sparkles className="size-3.5" />
                <span className="text-sm">Compose Assistant (Preview)</span>
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

          <div className="px-4 py-3 max-h-80 overflow-y-auto space-y-3">
            {error ? (
              <div className="space-y-2">
                <p className="text-sm text-destructive">
                  Something went wrong. Please try again.
                </p>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    clearError();
                    setMessages([]);
                    sendMessage({ text: "Rewrite" });
                  }}
                >
                  Retry
                </Button>
              </div>
            ) : composeText ? (
              <MessageResponse parseIncompleteMarkdown={status !== "ready"}>
                {composeText}
              </MessageResponse>
            ) : status === "submitted" || status === "streaming" ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Click Compose to generate suggestions.
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 border-t px-3 py-2 bg-muted/30">
            <Button
              type="submit"
              size={"sm"}
              variant={"outline"}
              onClick={() => {
                stop();
                clearError();
                setMessages([]);
                setOpen(false);
              }}
            >
              Decline
            </Button>
            <Button
              size={"sm"}
              type="submit"
              onClick={() => {
                if (!composeText) return;
                onAccept?.(composeText);
                stop();
                clearError();
                setMessages([]);
                setOpen(false);
              }}
              disabled={!composeText}
            >
              Accept
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default ComposeAssistant;

// make this component responsive with better error handling only show proper errors(not for debugging) for production
