import { base } from "../middleware/base";
import { requiredAuthMiddleware } from "../middleware/auth";
import { requiredWorkspaceMiddleware } from "../middleware/workspace";
import z from "zod";
import prisma from "@/lib/db";
import { JSONToMarkdown } from "@/lib/json-to-markdown";
import { streamText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamToEventIterator } from "@orpc/server";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_LLM_KEY,
});

const MODEL_ID = "x-ai/grok-4.1-fast:free";

const model = openrouter.chat(MODEL_ID);

export const generateThreadSummary = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .route({
    method: "GET",
    path: "/ai/thread/summary",
    summary: "Generate a summary of a thread",
    tags: ["AI"],
  })
  .input(
    z.object({
      messageId: z.string(),
    })
  )
  .handler(async ({ input, context, errors }) => {
    const baseMessage = await prisma.message.findFirst({
      where: {
        id: input.messageId,
        channel: {
          workspaceId: context.workspace.orgCode,
        },
      },
      select: {
        id: true,
        threadId: true,
        channelId: true,
      },
    });

    if (!baseMessage) {
      throw errors.NOT_FOUND();
    }

    const parentId = baseMessage.threadId || baseMessage.id;
    const parent = await prisma.message.findFirst({
      where: {
        id: parentId,
        channel: {
          workspaceId: context.workspace.orgCode,
        },
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        authorName: true,
        replies: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            content: true,
            createdAt: true,
            authorName: true,
          },
        },
      },
    });

    if (!parent) {
      throw errors.NOT_FOUND();
    }

    const replies = parent.replies.slice().reverse();

    const parentText = await JSONToMarkdown(parent.content);

    const lines = [];

    lines.push(
      `Thread Root - ${parent.authorName} - ${parent.createdAt.toISOString()}`
    );

    lines.push(parentText);

    if (replies.length > 0) {
      lines.push("\nReplies");
      for (const r of replies) {
        const t = await JSONToMarkdown(r.content);

        lines.push(`- ${r.authorName} - ${r.createdAt.toISOString()}: ${t}`);
      }
    }

    const compiled = lines.join("\n");

    const system = [
      "You are an expert assistant summarizing Slack-like discurssion threads for a product team.",
      "Use only the provided thread content; do not ivent facts, names, or timelines",
      "Output format (Makrdown):",
      "- First, write a single concise paragraph (2-4 sentences) that captures the thread's purpose, key decisions, context, and any blockers or next steps. No heading, no list, no intro text.",
      "- Then add a blank line followed by exactly 2-3 bullet points (using '-') with the most importatn takeways. Each bullet is one sentence.",
      "Style: neutral, specific, and concise. Preserve terminology from the thread (names, acronyms). Avoid filler or meta-commentary. DO not add a closing sentence.",
      "If the context is insufficient, return a single-sentence summary and omit the bullet list.",
    ].join("\n");

    const result = streamText({
      model,
      system,
      messages: [{ role: "user", content: compiled }],
      temperature: 0.2,
    });

    return streamToEventIterator(result.toUIMessageStream());
  });
