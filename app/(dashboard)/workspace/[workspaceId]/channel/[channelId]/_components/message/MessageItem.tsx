import { SafeContent } from "@/components/rich-text-editor/SafeContent";
import { getAvatar } from "@/lib/get-avatar";
import Image from "next/image";
import { MessageHoverToolbar } from "../toolbar";
import { useCallback, useState } from "react";
import EditMessage from "../toolbar/EditMessage";
import { MessageListItem } from "@/lib/types";
import { MessageSquareIcon } from "lucide-react";
import { useThread } from "@/providers/ThreadProvider";
import { orpc } from "@/lib/orpc";
import { useQueryClient } from "@tanstack/react-query";
import ReactionBar from "../reaction/ReactionBar";
import { useDeleteMessage } from "@/hooks/use-delete-message";

interface MessageItemProps {
  message: MessageListItem;
  currentUserId: string;
}

const MessageItem = ({ message, currentUserId }: MessageItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { openThread } = useThread();
  const queryClient = useQueryClient();

  // Initialize delete hook with proper context
  const { deleteMessage } = useDeleteMessage({
    channelId: message.channelId!,
    threadId: message.threadId,
  });

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

  const handleMessageTap = () => {
    // Only toggle on mobile/touch devices
    if (window.matchMedia("(max-width: 768px)").matches) {
      setShowMobileMenu((prev) => !prev);
    }
  };

  const handleDelete = useCallback(
    async (messageId: string) => {
      await deleteMessage(messageId);
    },
    [deleteMessage]
  );

  return (
    <>
      <div
        className="flex gap-2 sm:gap-3 relative p-2 sm:p-2.5 rounded-lg group hover:bg-muted/50 transition-colors"
        onClick={handleMessageTap}
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
              {new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }).format(message.createdAt)}{" "}
              {new Intl.DateTimeFormat("en-GB", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
              }).format(message.createdAt)}
            </p>
          </div>

          {/* Message Body */}
          {isEditing ? (
            <EditMessage
              message={message}
              onCancel={() => setIsEditing(false)}
              onSave={() => setIsEditing(false)}
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
              {message.replyCount > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openThread(message.id);
                  }}
                  type="button"
                  className="mt-1 cursor-pointer inline-flex items-center gap-1 text-[11px] sm:text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded px-1 py-0.5 -ml-1 transition-colors"
                  onMouseEnter={prefetchThread}
                  onFocus={prefetchThread}
                >
                  <MessageSquareIcon className="size-3 sm:size-3.5" />
                  <span>
                    {message.replyCount}{" "}
                    {message.replyCount === 1 ? "reply" : "replies"}
                  </span>
                  <span className="hidden sm:inline opacity-0 group-hover:opacity-100 transition-opacity">
                    View Thread
                  </span>
                </button>
              )}
            </>
          )}
        </div>

        {/* Toolbar - now with onDelete handler */}
        <MessageHoverToolbar
          messageId={message.id}
          canEdit={message.authorId === currentUserId}
          onEdit={() => {
            setIsEditing(true);
            setShowMobileMenu(false);
          }}
          onDelete={handleDelete}
          showMobile={showMobileMenu}
          onClose={() => setShowMobileMenu(false)}
        />
      </div>
    </>
  );
};

export default MessageItem;
