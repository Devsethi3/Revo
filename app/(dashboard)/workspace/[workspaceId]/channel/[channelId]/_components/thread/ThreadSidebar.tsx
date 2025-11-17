import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import Image from "next/image";
import ThreadReply from "./ThreadReply";

const messages = [
  {
    id: 1,
    authorName: "Dev Sethi",
    authorImage: "https://avatars.githubusercontent.com/u/147725410?v=4",
    content: "Something is missing in this thread",
    createdAt: new Date(),
  },
  {
    id: 2,
    authorName: "John Doe",
    authorImage: "https://avatars.githubusercontent.com/u/147725410?v=4",
    content:
      "Hey there! I'm a Frontend Developer with a passion for crafting slick, user-friendly interfaces.",
    createdAt: new Date(),
  },
  {
    id: 3,
    authorName: "Nathan Fisher",
    authorImage: "https://avatars.githubusercontent.com/u/147725410?v=4",
    content: "Building web apps that not only look great",
    createdAt: new Date(),
  },
  {
    id: 4,
    authorName: "John Snow",
    authorImage: "https://avatars.githubusercontent.com/u/147725410?v=4",
    content:
      "Whether it's making websites more responsive or creating intuitive user experiences, I'm your go-to dev!",
    createdAt: new Date(),
  },
];

const ThreadSidebar = () => {
  return (
    <>
      <div className="w-120 border-l flex flex-col h-full">
        {/* Header */}
        <div className="border-b h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-4" />
            <span>Thread</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size={"icon"}>
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b bg-muted-20">
            <div className="flex space-x-3">
              <Image
                src={messages[0].authorImage}
                alt="Author Image"
                width={32}
                height={32}
                className="size-8 rounded-full shrink-0"
              />

              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">
                    {messages[0].authorName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                      month: "short",
                      day: "numeric",
                    }).format(messages[0].createdAt)}
                  </span>
                </div>

                <p className="text-sm wrap-break-word prose dark:prose-invert max-w-none">
                  {messages[0].content}
                </p>
              </div>
            </div>
          </div>

          {/* Thread Replies */}
          <div className="p-2">
            <p className="text-xs text-muted-foreground mb-3 px-2">
              {messages.length} replies
            </p>

            <div className="space-y-1">
              {messages.map((reply) => (
                <ThreadReply message={reply} key={reply.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThreadSidebar;
