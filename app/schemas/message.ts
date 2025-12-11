import z from "zod";

export const createMessageSchema = z.object({
  channelId: z.string(),
  content: z.string(),
  imageUrl: z.url().optional(),
  threadId: z.string().optional(),
});

export const updateMessageSchema = z.object({
  messageId: z.string(),
  content: z.string(),
});

export const searchMessagesSchema = z.object({
  query: z.string().min(1).max(100),
  channelId: z.string().optional(),
  limit: z.number().min(1).max(50).optional(),
  cursor: z.string().optional(),
});

// Add delete schema
export const deleteMessageSchema = z.object({
  messageId: z.string(),
});

export const toggleReactionSchema = z.object({
  messageId: z.string(),
  emoji: z.string().min(1),
});

export const groupReactionSchema = z.object({
  emoji: z.string(),
  count: z.number(),
  reactedByMe: z.boolean(),
});

export type CreateMessageSchemaType = z.infer<typeof createMessageSchema>;
export type UpdateMessageSchemaType = z.infer<typeof updateMessageSchema>;
export type DeleteMessageSchemaType = z.infer<typeof deleteMessageSchema>;
export type GroupReactionSchemaType = z.infer<typeof groupReactionSchema>;
