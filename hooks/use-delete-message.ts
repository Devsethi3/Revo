import { MessageListItem } from "@/lib/types";
import { orpc } from "@/lib/orpc";
import { useChannelRealtime } from "@/providers/ChannelRealtimeProvider";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

type MessagePage = { items: MessageListItem[]; nextCursor?: string };
type InfiniteMessages = InfiniteData<MessagePage>;

type ThreadData = {
  parent: MessageListItem;
  messages: MessageListItem[];
};

interface UseDeleteMessageOptions {
  channelId: string;
  threadId?: string | null;
}

export function useDeleteMessage({
  channelId,
  threadId,
}: UseDeleteMessageOptions) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    orpc.message.delete.mutationOptions({
      onMutate: async (variables) => {
        // Cancel any outgoing refetches to prevent overwriting optimistic update
        await queryClient.cancelQueries({
          queryKey: ["message.list", channelId],
        });

        // If this is a thread reply, also cancel thread queries
        if (threadId) {
          await queryClient.cancelQueries({
            queryKey: ["message.thread.list", threadId],
          });
        }

        // Snapshot the previous values for rollback
        const previousMessages = queryClient.getQueryData<InfiniteMessages>([
          "message.list",
          channelId,
        ]);

        const previousThread = threadId
          ? queryClient.getQueryData<ThreadData>([
              "message.thread.list",
              threadId,
            ])
          : undefined;

        // Optimistically remove from channel message list
        queryClient.setQueryData<InfiniteMessages>(
          ["message.list", channelId],
          (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                items: page.items.filter((m) => m.id !== variables.messageId),
              })),
            };
          }
        );

        // If deleting a thread reply, update thread data
        if (threadId) {
          queryClient.setQueryData<ThreadData>(
            ["message.thread.list", threadId],
            (old) => {
              if (!old) return old;
              return {
                ...old,
                messages: old.messages.filter(
                  (m) => m.id !== variables.messageId
                ),
              };
            }
          );

          // Also decrement the reply count in the parent message in the main list
          queryClient.setQueryData<InfiniteMessages>(
            ["message.list", channelId],
            (old) => {
              if (!old) return old;
              return {
                ...old,
                pages: old.pages.map((page) => ({
                  ...page,
                  items: page.items.map((m) =>
                    m.id === threadId
                      ? { ...m, replyCount: Math.max(0, m.replyCount - 1) }
                      : m
                  ),
                })),
              };
            }
          );
        }

        // If deleting a parent message (that has replies),
        // we should also invalidate/remove the thread cache
        const deletingMessage = previousMessages?.pages
          .flatMap((p) => p.items)
          .find((m) => m.id === variables.messageId);

        if (deletingMessage && deletingMessage.replyCount > 0) {
          queryClient.removeQueries({
            queryKey: ["message.thread.list", variables.messageId],
          });
        }

        return { previousMessages, previousThread };
      },
      onError: (err, variables, context) => {
        // Rollback to the previous state on error
        if (context?.previousMessages) {
          queryClient.setQueryData(
            ["message.list", channelId],
            context.previousMessages
          );
        }

        if (context?.previousThread && threadId) {
          queryClient.setQueryData(
            ["message.thread.list", threadId],
            context.previousThread
          );
        }

        toast.error(err.message || "Failed to delete message");
      },
      onSuccess: (data) => {
        toast.success("Message deleted");
      },
      onSettled: () => {
        // Optionally refetch to ensure consistency
        // queryClient.invalidateQueries({ queryKey: ["message.list", channelId] });
      },
    })
  );

  const deleteMessage = async (messageId: string): Promise<void> => {
    await deleteMutation.mutateAsync({ messageId });
  };

  return {
    deleteMessage,
    isDeleting: deleteMutation.isPending,
  };
}
