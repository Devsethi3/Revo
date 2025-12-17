import { SafeContent } from "@/components/rich-text-editor/SafeContent";
import Image from "next/image";
import ReactionBar from "../reaction/ReactionBar";
import { MessageListItem } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ThreadReplyProps {
  message: MessageListItem;
  selectedThreadId: string;
}

const ThreadReply = ({ message, selectedThreadId }: ThreadReplyProps) => {
  return (
    <div>
      <div className="flex space-x-3 p-3 hover:bg-muted/30 rounded-lg">
        <Avatar className="relative size-8 rounded-lg">
          <Image
            src={message.authorAvatar}
            alt={`${message.authorName}'s avatar`}
            className="size-7 sm:size-8 rounded-lg shrink-0"
            unoptimized
            fill
          />
          <AvatarFallback className="bg-linear-to-br from-emerald-700 via-emerald-800 to-indigo-700 font-semibold text-white">
            {message.authorName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">{message.authorName}</span>
            <span className="text-xs text-muted-foreground">
              {new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
                month: "short",
                day: "numeric",
              }).format(message.createdAt)}
            </span>
          </div>

          <SafeContent
            content={JSON.parse(message.content)}
            className="text-sm wrap-break-word prose dark:prose-invert max-w-none"
          />

          {message.imageUrl && (
            <div className="mt-2">
              <Image
                src={message.imageUrl}
                alt="Message Attachment"
                width={512}
                height={512}
                className="rounded-md max-h-80 object-contain"
              />
            </div>
          )}

          <ReactionBar
            context={{ type: "thread", threadId: selectedThreadId }}
            reactions={message.reactions}
            messageId={message.id}
          />
        </div>
      </div>
    </div>
  );
};

export default ThreadReply;
