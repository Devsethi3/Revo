// router/message.ts

import z from "zod";
import { standardSecurityMiddleware } from "../middleware/arcjet/standard";
import { writeSecurityMiddleware } from "../middleware/arcjet/write";
import { requiredAuthMiddleware } from "../middleware/auth";
import { base } from "../middleware/base";
import { requiredWorkspaceMiddleware } from "../middleware/workspace";
import prisma from "@/lib/db";
import {
  createMessageSchema,
  deleteMessageSchema,
  groupReactionSchema,
  GroupReactionSchemaType,
  toggleReactionSchema,
  updateMessageSchema,
} from "../schemas/message";
import { getAvatar } from "@/lib/get-avatar";
import { readSecurityMiddleware } from "../middleware/arcjet/read";
import { Message } from "@/lib/generated/prisma/client";
import { MessageListItem } from "@/lib/types";

function groupReactions(
  reactions: { emoji: string; userId: string }[],
  userId: string
): GroupReactionSchemaType[] {
  const reactionMap = new Map<
    string,
    { count: number; reactedByMe: boolean }
  >();

  for (const reaction of reactions) {
    const existing = reactionMap.get(reaction.emoji);

    if (existing) {
      existing.count += 1;
      if (reaction.userId === userId) {
        existing.reactedByMe = true;
      }
    } else {
      reactionMap.set(reaction.emoji, {
        count: 1,
        reactedByMe: reaction.userId === userId,
      });
    }
  }

  return Array.from(reactionMap.entries()).map(([emoji, data]) => ({
    emoji,
    count: data.count,
    reactedByMe: data.reactedByMe,
  }));
}

export const createMessage = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(writeSecurityMiddleware)
  .route({
    method: "POST",
    path: "/messages",
    summary: "Create a message",
    tags: ["Messages"],
  })
  .input(createMessageSchema)
  .output(z.custom<Message>())
  .handler(async ({ input, context, errors }) => {
    // Verify the channel belongs to the user's organization
    const channel = await prisma.channel.findFirst({
      where: {
        id: input.channelId,
        workspaceId: context.workspace.orgCode,
      },
    });

    if (!channel) {
      throw errors.FORBIDDEN();
    }

    // if this is a thread reply, validate the parent message
    if (input.threadId) {
      const parentMessage = await prisma.message.findFirst({
        where: {
          id: input.threadId,
          channel: {
            workspaceId: context.workspace.orgCode,
          },
        },
      });

      if (
        !parentMessage ||
        parentMessage.channelId !== input.channelId ||
        parentMessage.threadId !== null
      ) {
        throw errors.BAD_REQUEST();
      }
    }

    const created = await prisma.message.create({
      data: {
        content: input.content,
        imageUrl: input.imageUrl,
        channelId: input.channelId,
        authorId: context.user.id,
        authorEmail: context.user.email!,
        authorName: context.user.given_name ?? "John Doe",
        authorAvatar: getAvatar(context.user.picture, context.user.email!),
        threadId: input.threadId,
      },
    });

    return created;
  });

export const listMessages = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(readSecurityMiddleware)
  .route({
    method: "GET",
    path: "/messages",
    summary: "List all messages",
    tags: ["Messages"],
  })
  .input(
    z.object({
      channelId: z.string(),
      limit: z.number().min(1).max(100).optional(),
      cursor: z.string().optional(),
    })
  )
  .output(
    z.object({
      items: z.array(z.custom<MessageListItem>()),
      nextCursor: z.string().optional(),
    })
  )
  .handler(async ({ input, context, errors }) => {
    const channel = await prisma.channel.findFirst({
      where: {
        id: input.channelId,
        workspaceId: context.workspace.orgCode,
      },
    });

    if (!channel) {
      throw errors.FORBIDDEN();
    }

    const limit = input.limit ?? 30;

    const messages = await prisma.message.findMany({
      where: {
        channelId: input.channelId,
        threadId: null,
      },
      ...(input.cursor
        ? {
            cursor: { id: input.cursor },
            skip: 1,
          }
        : {}),
      take: limit,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      include: {
        _count: {
          select: { replies: true },
        },
        MessageReaction: {
          select: {
            emoji: true,
            userId: true,
          },
        },
      },
    });

    const items: MessageListItem[] = messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      imageUrl: msg.imageUrl,
      channelId: msg.channelId,
      authorId: msg.authorId,
      updatedAt: msg.updatedAt,
      createdAt: msg.createdAt,
      authorEmail: msg.authorEmail,
      authorAvatar: msg.authorAvatar,
      authorName: msg.authorName,
      threadId: msg.threadId,
      replyCount: msg._count.replies,
      reactions: groupReactions(
        msg.MessageReaction.map((r) => ({
          emoji: r.emoji,
          userId: r.userId,
        })),
        context.user.id
      ),
    }));

    const nextCursor =
      messages.length === limit ? messages[messages.length - 1].id : undefined;

    return {
      items: items,
      nextCursor,
    };
  });

export const updateMessage = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(writeSecurityMiddleware)
  .route({
    method: "PUT",
    path: "/messages/:messageId",
    summary: "Update a message",
    tags: ["Messages"],
  })
  .input(updateMessageSchema)
  .output(
    z.object({
      message: z.custom<Message>(),
      canEdit: z.boolean(),
    })
  )
  .handler(async ({ input, context, errors }) => {
    const message = await prisma.message.findFirst({
      where: {
        id: input.messageId,
        channel: {
          workspaceId: context.workspace.orgCode,
        },
      },
      select: {
        id: true,
        authorId: true,
      },
    });

    if (!message) {
      throw errors.NOT_FOUND();
    }

    if (message.authorId !== context.user.id) {
      throw errors.FORBIDDEN();
    }

    const updated = await prisma.message.update({
      where: {
        id: input.messageId,
      },
      data: {
        content: input.content,
      },
    });

    return {
      message: updated,
      canEdit: updated.authorId === context.user.id,
    };
  });
export const listThreadReplies = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(readSecurityMiddleware)
  .route({
    method: "GET",
    path: "/messages/thread/:messageId",
    summary: "List all replies in a thread",
    tags: ["Messages"],
  })
  .input(
    z.object({
      messageId: z.string(),
    })
  )
  .output(
    z.object({
      parent: z.custom<MessageListItem>(),
      messages: z.array(z.custom<MessageListItem>()),
    })
  )
  .handler(async ({ input, context, errors }) => {
    const parentRow = await prisma.message.findFirst({
      where: {
        id: input.messageId,
        channel: {
          workspaceId: context.workspace.orgCode,
        },
      },
      include: {
        _count: {
          select: { replies: true },
        },
        MessageReaction: {
          select: { emoji: true, userId: true },
        },
      },
    });

    if (!parentRow) throw errors.NOT_FOUND();

    // Map parent message
    const parent: MessageListItem = {
      id: parentRow.id,
      content: parentRow.content,
      imageUrl: parentRow.imageUrl,
      authorAvatar: parentRow.authorAvatar,
      authorEmail: parentRow.authorEmail,
      authorId: parentRow.authorId,
      authorName: parentRow.authorName,
      channelId: parentRow.channelId,
      createdAt: parentRow.createdAt,
      updatedAt: parentRow.updatedAt,
      threadId: parentRow.threadId,
      replyCount: parentRow._count?.replies ?? 0,
      reactions: groupReactions(
        parentRow.MessageReaction.map((r) => ({
          emoji: r.emoji,
          userId: r.userId,
        })),
        context.user.id
      ),
    };

    // Fetch thread replies
    const messagesQuery = await prisma.message.findMany({
      where: { threadId: input.messageId },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      include: {
        _count: {
          select: { replies: true },
        },
        MessageReaction: {
          select: { emoji: true, userId: true },
        },
      },
    });

    const messages: MessageListItem[] = messagesQuery.map((msg) => ({
      id: msg.id,
      content: msg.content,
      imageUrl: msg.imageUrl,
      authorAvatar: msg.authorAvatar,
      authorEmail: msg.authorEmail,
      authorId: msg.authorId,
      authorName: msg.authorName,
      channelId: msg.channelId,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
      threadId: msg.threadId,
      replyCount: msg._count?.replies ?? 0,
      reactions: groupReactions(
        msg.MessageReaction.map((r) => ({
          emoji: r.emoji,
          userId: r.userId,
        })),
        context.user.id
      ),
    }));

    return {
      parent,
      messages,
    };
  });

export const toggleMessageReaction = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(writeSecurityMiddleware)
  .route({
    method: "POST",
    path: "/messages/:messageId/reactions",
    summary: "Toggle a reaction on a message",
    tags: ["Messages"],
  })
  .input(toggleReactionSchema)
  .output(
    z.object({
      messageId: z.string(),
      reactions: z.array(groupReactionSchema),
    })
  )
  .handler(async ({ input, context, errors }) => {
    const message = await prisma.message.findFirst({
      where: {
        id: input.messageId,
        channel: {
          workspaceId: context.workspace.orgCode,
        },
      },
      select: {
        id: true,
      },
    });

    if (!message) {
      throw errors.NOT_FOUND();
    }

    const inserted = await prisma.messageReaction.createMany({
      data: [
        {
          emoji: input.emoji,
          messageId: input.messageId,
          userId: context.user.id,
          userName: context.user.given_name ?? "John Doe",
          userAvatar: getAvatar(context.user.picture, context.user.email!),
          userEmail: context.user.email!,
        },
      ],
      skipDuplicates: true,
    });

    if (inserted.count === 0) {
      // Reaction already exists, remove it
      await prisma.messageReaction.deleteMany({
        where: {
          messageId: input.messageId,
          userId: context.user.id,
          emoji: input.emoji,
        },
      });
    }

    const updated = await prisma.message.findUnique({
      where: {
        id: input.messageId,
      },
      include: {
        MessageReaction: {
          select: {
            emoji: true,
            userId: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    if (!updated) {
      throw errors.NOT_FOUND();
    }

    return {
      messageId: updated.id,
      reactions: groupReactions(
        (updated.MessageReaction ?? []).map((r) => ({
          emoji: r.emoji,
          userId: r.userId,
        })),
        context.user.id
      ),
    };
  });

export const deleteMessage = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(writeSecurityMiddleware)
  .route({
    method: "DELETE",
    path: "/messages/:messageId",
    summary: "Delete a message",
    tags: ["Messages"],
  })
  .input(deleteMessageSchema)
  .output(
    z.object({
      success: z.boolean(),
      messageId: z.string(),
      channelId: z.string(),
      threadId: z.string().nullable(),
    })
  )
  .handler(async ({ input, context, errors }) => {
    // Find the message and verify ownership
    const message = await prisma.message.findFirst({
      where: {
        id: input.messageId,
        channel: {
          workspaceId: context.workspace.orgCode,
        },
      },
      select: {
        id: true,
        authorId: true,
        channelId: true,
        threadId: true,
      },
    });

    if (!message) {
      throw errors.NOT_FOUND();
    }

    // Only the author can delete their message
    if (message.authorId !== context.user.id) {
      throw errors.FORBIDDEN();
    }

    // Delete the message (cascade handles replies and reactions via Prisma schema)
    await prisma.message.delete({
      where: {
        id: input.messageId,
      },
    });

    return {
      success: true,
      messageId: input.messageId,
      channelId: message.channelId!,
      threadId: message.threadId,
    };
  });

  // router/message.ts - Add this endpoint

export const searchMessages = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(readSecurityMiddleware)
  .route({
    method: "GET",
    path: "/messages/search",
    summary: "Search messages in workspace",
    tags: ["Messages"],
  })
  .input(
    z.object({
      query: z.string().min(1).max(100),
      channelId: z.string().optional(),
      limit: z.number().min(1).max(50).optional(),
      cursor: z.string().optional(),
    })
  )
  .output(
    z.object({
      items: z.array(
        z.custom<
          MessageListItem & {
            channelName: string;
            matchHighlight?: string;
          }
        >()
      ),
      nextCursor: z.string().optional(),
      totalCount: z.number(),
    })
  )
  .handler(async ({ input, context, errors }) => {
    const limit = input.limit ?? 20;
    const searchQuery = input.query.trim();

    // Build where clause
    const whereClause: any = {
      channel: {
        workspaceId: context.workspace.orgCode,
      },
      content: {
        contains: searchQuery,
        mode: "insensitive",
      },
    };

    // Optional: filter by specific channel
    if (input.channelId) {
      whereClause.channelId = input.channelId;
    }

    // Get total count for the search
    const totalCount = await prisma.message.count({
      where: whereClause,
    });

    // Fetch messages with pagination
    const messages = await prisma.message.findMany({
      where: whereClause,
      ...(input.cursor
        ? {
            cursor: { id: input.cursor },
            skip: 1,
          }
        : {}),
      take: limit,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      include: {
        channel: {
          select: {
            name: true,
          },
        },
        _count: {
          select: { replies: true },
        },
        MessageReaction: {
          select: {
            emoji: true,
            userId: true,
          },
        },
      },
    });

    const items = messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      imageUrl: msg.imageUrl,
      channelId: msg.channelId,
      authorId: msg.authorId,
      updatedAt: msg.updatedAt,
      createdAt: msg.createdAt,
      authorEmail: msg.authorEmail,
      authorAvatar: msg.authorAvatar,
      authorName: msg.authorName,
      threadId: msg.threadId,
      replyCount: msg._count.replies,
      channelName: msg.channel?.name ?? "Unknown",
      reactions: groupReactions(
        msg.MessageReaction.map((r) => ({
          emoji: r.emoji,
          userId: r.userId,
        })),
        context.user.id
      ),
    }));

    const nextCursor =
      messages.length === limit ? messages[messages.length - 1].id : undefined;

    return {
      items,
      nextCursor,
      totalCount,
    };
  });