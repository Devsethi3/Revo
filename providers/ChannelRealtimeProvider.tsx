import {
  ChannelEventSchema,
  ChannelEventType,
  RealtimeMessageType,
} from "@/app/schemas/realtime";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import usePartySocket from "partysocket/react";
import { createContext, ReactNode, useContext, useMemo } from "react";

type ChannelRealtimeContextValue = {
  send: (event: ChannelEventType) => void;
};

interface ChannelRealtimeProviderProps {
  channelId: string;
  children: ReactNode;
}

type MessageListPage = { items: RealtimeMessageType[]; nextCursor?: string };
type InfiniteMessages = InfiniteData<MessageListPage>;

const ChannelRealtimeContext =
  createContext<ChannelRealtimeContextValue | null>(null);

export function ChannelRealtimeProvider({
  children,
  channelId,
}: ChannelRealtimeProviderProps) {
  const queryClient = useQueryClient();

  const socket = usePartySocket({
    host: "https://revo.try-devsethi.workers.dev",
    room: `channel-${channelId}`,
    party: "chat",
    onMessage(e) {
      try {
        const parsed = JSON.parse(e.data);
        const result = ChannelEventSchema.safeParse(parsed);

        if (!result.success) {
          console.warn("Invalid channel event", result.error);
          return;
        }

        const event = result.data;

        if (event.type === "message:created") {
          const raw = event.payload.message;

          queryClient.setQueryData<InfiniteMessages>(
            ["message.list", channelId],
            (old) => {
              if (!old) {
                return {
                  pages: [
                    {
                      items: [raw],
                      nextCursor: undefined,
                    },
                  ],
                  pageParams: [undefined],
                } as InfiniteMessages;
              }

              const first = old.pages[0];
              const updatedFirst: MessageListPage = {
                ...first,
                items: [raw, ...first.items],
              };

              return {
                ...old,
                pages: [updatedFirst, ...old.pages.slice(1)],
              };
            }
          );
          return;
        }

        if (event.type === "message:updated") {
          const updated = event.payload.message;

          queryClient.setQueryData<InfiniteMessages>(
            ["message.list", channelId],
            (old) => {
              if (!old) return old;

              const pages = old.pages.map((p) => ({
                ...p,
                items: p.items.map((m) =>
                  m.id === updated.id ? { ...m, ...updated } : m
                ),
              }));

              return { ...old, pages };
            }
          );
          return;
        }

        // Handle message deletion
        if (event.type === "message:deleted") {
          const { messageId, threadId, hasReplies } = event.payload;

          // Remove message from channel list
          queryClient.setQueryData<InfiniteMessages>(
            ["message.list", channelId],
            (old) => {
              if (!old) return old;

              const pages = old.pages.map((p) => ({
                ...p,
                items: p.items.filter((m) => m.id !== messageId),
              }));

              return { ...old, pages };
            }
          );

          // If this was a thread reply, decrement parent's reply count
          if (threadId) {
            queryClient.setQueryData<InfiniteMessages>(
              ["message.list", channelId],
              (old) => {
                if (!old) return old;

                const pages = old.pages.map((p) => ({
                  ...p,
                  items: p.items.map((m) =>
                    m.id === threadId
                      ? {
                          ...m,
                          replyCount: Math.max(0, (m.replyCount ?? 0) - 1),
                        }
                      : m
                  ),
                }));

                return { ...old, pages };
              }
            );

            // Also update thread cache if it exists
            type ThreadData = {
              parent: RealtimeMessageType;
              messages: RealtimeMessageType[];
            };

            queryClient.setQueryData<ThreadData>(
              ["message.thread.list", threadId],
              (old) => {
                if (!old) return old;
                return {
                  ...old,
                  messages: old.messages.filter((m) => m.id !== messageId),
                };
              }
            );
          }

          // If deleted message had replies, remove its thread cache
          if (hasReplies) {
            queryClient.removeQueries({
              queryKey: ["message.thread.list", messageId],
            });
          }

          return;
        }

        if (event.type === "reaction:updated") {
          const { messageId, reactions } = event.payload;

          queryClient.setQueryData<InfiniteMessages>(
            ["message.list", channelId],
            (old) => {
              if (!old) return old;

              const pages = old.pages.map((p) => ({
                ...p,
                items: p.items.map((m) =>
                  m.id === messageId ? { ...m, reactions } : m
                ),
              }));

              return { ...old, pages };
            }
          );
          return;
        }

        if (event.type === "message:replies:increment") {
          const { messageId, delta } = event.payload;

          queryClient.setQueryData<InfiniteMessages>(
            ["message.list", channelId],
            (old) => {
              if (!old) return old;

              const pages = old.pages.map((p) => ({
                ...p,
                items: p.items.map((m) =>
                  m.id === messageId
                    ? {
                        ...m,
                        replyCount: Math.max(
                          0,
                          Number(m.replyCount ?? 0) + Number(delta)
                        ),
                      }
                    : m
                ),
              }));
              return { ...old, pages };
            }
          );
          return;
        }
      } catch (error) {
        console.error("Channel Provider Error", error);
      }
    },
  });

  const value = useMemo<ChannelRealtimeContextValue>(() => {
    return {
      send: (event) => {
        socket.send(JSON.stringify(event));
      },
    };
  }, [socket]);

  return (
    <ChannelRealtimeContext.Provider value={value}>
      {children}
    </ChannelRealtimeContext.Provider>
  );
}

export function useChannelRealtime(): ChannelRealtimeContextValue {
  const ctx = useContext(ChannelRealtimeContext);

  if (!ctx) {
    throw new Error(
      "useChannelRealtime must be used within a channel realtime provider"
    );
  }

  return ctx;
}
