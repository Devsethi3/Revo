import { SafeContent } from "@/components/rich-text-editor/SafeContent";
import { getAvatar } from "@/lib/get-avatar";
import Image from "next/image";
import { MessageHoverToolbar } from "../toolbar";
import { forwardRef, useCallback, useState, useMemo } from "react";
import EditMessage from "../toolbar/EditMessage";
import { MessageListItem } from "@/lib/types";
import {
  ArrowRightIcon,
  ChevronRightIcon,
  MessageSquareIcon,
} from "lucide-react";
import { useThread } from "@/providers/ThreadProvider";
import { orpc } from "@/lib/orpc";
import { useQueryClient } from "@tanstack/react-query";
import ReactionBar from "../reaction/ReactionBar";
import { useDeleteMessage } from "@/hooks/use-delete-message";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: MessageListItem;
  currentUserId: string;
  isHighlighted?: boolean;
}

const MessageItem = forwardRef<HTMLDivElement, MessageItemProps>(
  ({ message, currentUserId, isHighlighted = false }, ref) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const { openThread } = useThread();
    const queryClient = useQueryClient();

    // Initialize delete hook with proper context
    const { deleteMessage } = useDeleteMessage({
      channelId: message.channelId!,
      threadId: message.threadId,
    });

    // Memoize reply count to avoid recalculation
    const replyCount = useMemo(() => {
      const count = Number(message.replyCount);
      return isNaN(count) || count < 0 ? 0 : count;
    }, [message.replyCount]);

    // Memoize formatted date strings
    const formattedDate = useMemo(() => {
      return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(message.createdAt);
    }, [message.createdAt]);

    const formattedTime = useMemo(() => {
      return new Intl.DateTimeFormat("en-GB", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }).format(message.createdAt);
    }, [message.createdAt]);

    const prefetchThread = useCallback(() => {
      const options = orpc.message.thread.list.queryOptions({
        input: {
          messageId: message.id,
        },
      });
      queryClient
        .prefetchQuery({ ...options, staleTime: 60_000 })
        .catch(() => {});
    }, [message.id, queryClient]);

    const handleMessageTap = useCallback(() => {
      // Only toggle on mobile/touch devices
      if (window.matchMedia("(max-width: 768px)").matches) {
        setShowMobileMenu((prev) => !prev);
      }
    }, []);

    const handleDelete = useCallback(
      async (messageId: string) => {
        await deleteMessage(messageId);
      },
      [deleteMessage]
    );

    const handleThreadClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        openThread(message.id);
      },
      [openThread, message.id]
    );

    const handleEditClick = useCallback(() => {
      setIsEditing(true);
      setShowMobileMenu(false);
    }, []);

    const handleEditCancel = useCallback(() => {
      setIsEditing(false);
    }, []);

    const handleEditSave = useCallback(() => {
      setIsEditing(false);
    }, []);

    const handleMobileMenuClose = useCallback(() => {
      setShowMobileMenu(false);
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-2 sm:gap-3 relative p-2 sm:p-2.5 rounded-lg group transition-all duration-300",
          "hover:bg-muted/50",
          // Highlight styles
          isHighlighted && [
            "bg-primary/10 dark:bg-primary/15",
            "ring-2 ring-primary/50",
            "animate-highlight-pulse",
          ]
        )}
        onClick={handleMessageTap}
        data-message-id={message.id}
      >
        {/* Avatar */}
        <Image
          src={getAvatar(message.authorAvatar, message.authorEmail)}
          alt="User Avatar"
          width={32}
          height={32}
          className="size-7 sm:size-8 rounded-lg shrink-0"
        />

        {/* Message Content */}
        <div className="flex-1 space-y-0.5 sm:space-y-1 min-w-0">
          {/* Author & Timestamp */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <p className="font-medium text-sm sm:text-base leading-none">
              {message.authorName}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-none">
              {formattedDate} {formattedTime}
            </p>
          </div>

          {/* Message Body */}
          {isEditing ? (
            <EditMessage
              message={message}
              onCancel={handleEditCancel}
              onSave={handleEditSave}
            />
          ) : (
            <>
              <SafeContent
                className="text-sm wrap-break-word prose prose-sm sm:prose-base dark:prose-invert max-w-none marker:text-primary"
                content={JSON.parse(message.content)}
              />

              {/* Image Attachment */}
              {message.imageUrl && (
                <div className="mt-2 sm:mt-3">
                  <Image
                    src={message.imageUrl}
                    alt="Message Attachment"
                    width={512}
                    height={512}
                    className="rounded-md max-h-48 sm:max-h-64 md:max-h-80 w-auto object-contain"
                  />
                </div>
              )}

              {/* Reactions */}
              <ReactionBar
                messageId={message.id}
                reactions={message.reactions}
                context={{ type: "list", channelId: message.channelId! }}
              />

              {/* Thread Reply Count */}
              {replyCount > 0 && (
                <button
                  onClick={handleThreadClick}
                  type="button"
                  className="group/thread mt-2 inline-flex items-center gap-1.5 border-l-2 border-primary/60 pl-2.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onMouseEnter={prefetchThread}
                  onFocus={prefetchThread}
                  aria-label={`View ${replyCount} ${
                    replyCount === 1 ? "reply" : "replies"
                  }`}
                >
                  <MessageSquareIcon className="size-3.5 text-primary/70" />
                  <span>
                    <span className="font-semibold text-foreground">
                      {replyCount}
                    </span>{" "}
                    {replyCount === 1 ? "reply" : "replies"}
                  </span>
                  <ArrowRightIcon className="size-3 opacity-0 transition-all group-hover/thread:translate-x-0.5 group-hover/ thread:opacity-100" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Toolbar - now with onDelete handler */}
        <MessageHoverToolbar
          messageId={message.id}
          canEdit={message.authorId === currentUserId}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          showMobile={showMobileMenu}
          onClose={handleMobileMenuClose}
        />
      </div>
    );
  }
);

MessageItem.displayName = "MessageItem";

export default MessageItem;
