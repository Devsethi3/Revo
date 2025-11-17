import Image from "next/image";

interface ThreadReplyProps {
  message: {
    id: number;
    authorName: string;
    authorImage: string;
    content: string;
    createdAt: Date;
  };
}

const ThreadReply = ({ message }: ThreadReplyProps) => {
  return (
    <div>
      <div className="flex space-x-3 p-3 hover:bg-muted/30 rounded-lg">
        <Image
          src={message.authorImage}
          alt="Author Avatar"
          width={24}
          height={24}
          className="size-6 rounded-full shrink-0 mt-1"
        />
      </div>
    </div>
  );
};

export default ThreadReply;
