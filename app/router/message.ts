import z from "zod";
import { standardSecurityMiddleware } from "../middleware/arcjet/standard";
import { writeSecurityMiddleware } from "../middleware/arcjet/write";
import { requiredAuthMiddleware } from "../middleware/auth";
import { base } from "../middleware/base";
import { requiredWorkspaceMiddleware } from "../middleware/workspace";
import prisma from "@/lib/db";
import { createMessageSchema, updateMessageSchema } from "../schemas/message";
import { getAvatar } from "@/lib/get-avatar";
import { readSecurityMiddleware } from "../middleware/arcjet/read";
import { Message } from "@/lib/generated/prisma/client";
import { MessageListItem } from "@/lib/types";


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
      repliesCount: msg._count.replies,
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
      parent: z.custom<Message>(),
      messages: z.array(z.custom<Message>()),
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
    });

    if (!parentRow) {
      throw errors.NOT_FOUND();
    }

    // Fetch all thread replies
    const replies = await prisma.message.findMany({
      where: {
        threadId: input.messageId,
      },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });

    return {
      parent: parentRow,
      messages: replies,
    };
  });
