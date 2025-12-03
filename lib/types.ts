import { GroupReactionSchemaType } from "@/app/schemas/message";
import { Message } from "./generated/prisma/client";

export type MessageListItem = Message & {
  replyCount: number;
  reactions: GroupReactionSchemaType[];
};
