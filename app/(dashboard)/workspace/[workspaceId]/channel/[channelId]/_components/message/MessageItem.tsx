import { SafeContent } from "@/components/rich-text-editor/SafeContent";
import { Message } from "@/lib/generated/prisma";
import { getAvatar } from "@/lib/get-avatar";
import Image from "next/image";

interface MessageItemProps {
  message: Message;
}

const MessageItem = ({ message }: MessageItemProps) => {
  return (
    <>
      <div className="flex space-x-3 relative p-2.5 rounded-lg group hover:bg-muted/50">
        <Image
          src={getAvatar(message.authorAvatar, message.authorEmail)}
          alt="User Avatar"
          width={32}
          height={32}
          className="size-8 rounded-lg"
        />

        <div className="flex-1 space-y-1 min-w-0">
          <div className="flex items-center gap-x-2">
            <p className="font-medium leading-none">{message.authorName}</p>
            <p className="text-xs text-muted-foreground leading-none">
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

          <SafeContent
            className="text-sm wrap-break-word prose dark:prose-invert max-w-none mark:text-primary"
            content={JSON.parse(message.content)}
          />

          {message.imageUrl && (
            <div className="mt-3">
              <Image
                src={message.imageUrl}
                alt="Message Attachment"
                width={512}
                height={512}
                className="rounded-md max-h-80 w-auto object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessageItem;
