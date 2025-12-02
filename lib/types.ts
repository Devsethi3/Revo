import { Message } from "./generated/prisma/client";

export type MessageListItem = Message & {
  repliesCount: number;
};
