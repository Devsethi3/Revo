import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import EmojiReaction from "./EmojiReaction";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { GroupReactionSchemaType } from "@/app/schemas/message";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { MessageListItem } from "@/lib/types";

type ThreadContext = { type: "thread"; threadId: string };
type ListContext = { type: "list"; channelId: string };

interface ReactionBarProps {
  messageId: string;
  reactions: GroupReactionSchemaType[];
  context?: ThreadContext | ListContext;
}

type MessagePage = {
  items: MessageListItem[];
  nextCursor?: string;
};

type InfiniteReplies = InfiniteData<MessagePage>;

const ReactionBar = ({ messageId, reactions, context }: ReactionBarProps) => {
  const { channelId } = useParams<{ channelId: string }>();
  const queryClient = useQueryClient();

  const bump = (
    rxns: GroupReactionSchemaType[],
    emoji: string
  ): GroupReactionSchemaType[] => {
    const found = rxns.find((r) => r.emoji === emoji);

    if (found) {
      const newCount = found.count - 1;

      return newCount <= 0
        ? rxns.filter((r) => r.emoji !== emoji)
        : rxns.map((r) =>
            r.emoji === emoji
              ? { ...r, count: newCount, reactedByMe: false }
              : r
          );
    }

    return [...rxns, { emoji, count: 1, reactedByMe: true }];
  };

  const toggleMutation = useMutation(
    orpc.message.reaction.toggle.mutationOptions({
      // Optimistic Update
      onMutate: async (vars: { messageId: string; emoji: string }) => {
        const emoji = vars.emoji;

        // THREAD MODE
        if (context?.type === "thread") {
          const threadOptions = orpc.message.thread.list.queryOptions({
            input: { messageId: context.threadId },
          });

          await queryClient.cancelQueries({ queryKey: threadOptions.queryKey });

          const prevThread = queryClient.getQueryData(threadOptions.queryKey);

          queryClient.setQueryData(threadOptions.queryKey, (old: any) => {
            if (!old) return old;

            const isParent = vars.messageId === context.threadId;

            return {
              ...old,
              parent: isParent
                ? {
                    ...old.parent,
                    reactions: bump(old.parent.reactions, emoji),
                  }
                : old.parent,
              messages: old.messages.map((msg: MessageListItem) =>
                msg.id === vars.messageId
                  ? { ...msg, reactions: bump(msg.reactions, emoji) }
                  : msg
              ),
            };
          });

          return {
            threadQueryKey: threadOptions.queryKey,
            prevThread,
          };
        }

        //  MESSAGE LIST MODE
        const listKey = ["message.list", channelId];
        await queryClient.cancelQueries({ queryKey: listKey });

        const prevList = queryClient.getQueryData(listKey);

        queryClient.setQueryData<InfiniteReplies>(listKey, (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((m) =>
                m.id === vars.messageId
                  ? { ...m, reactions: bump(m.reactions, emoji) }
                  : m
              ),
            })),
          };
        });

        return { prevList, listKey };
      },

      onSuccess: () => {
        toast.success("Reaction updated");
      },

      onError: (_, __, ctx) => {
        if (ctx?.threadQueryKey) {
          queryClient.setQueryData(ctx.threadQueryKey, ctx.prevThread);
        }

        if (ctx?.listKey) {
          queryClient.setQueryData(ctx.listKey, ctx.prevList);
        }

        toast.error("Failed to update reaction");
      },
    })
  );

  const handleToggle = (emoji: string) => {
    toggleMutation.mutate({ emoji, messageId });
  };

  return (
    <div className="mt-1 flex items-center gap-1">
      {reactions.map((r) => (
        <Button
          key={r.emoji}
          type="button"
          variant="secondary"
          size="sm"
          className={cn(
            "h-6 px-2 text-xs",
            r.reactedByMe && "bg-primary/20 border-primary border"
          )}
          onClick={() => handleToggle(r.emoji)}
        >
          <span>{r.emoji}</span>
          <span>{r.count}</span>
        </Button>
      ))}

      <EmojiReaction onSelect={handleToggle} />
    </div>
  );
};

export default ReactionBar;
