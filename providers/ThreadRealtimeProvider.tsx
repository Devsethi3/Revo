import { ThreadEventSchema } from "@/app/schemas/realtime";
import { useQueryClient } from "@tanstack/react-query";
import usePartySocket from "partysocket/react";
import { createContext, ReactNode } from "react";

interface ThreadRealtimeProviderProps {
  children: ReactNode;
  threadId: string;
}

const ThreadRealtimeContext = createContext(null);

export function ThreadRealtimeProvider({
  children,
  threadId,
}: ThreadRealtimeProviderProps) {
  const queryClient = useQueryClient();

  const socket = usePartySocket({
    host: "http://127.0.0.1:8787",
    room: `thread-${threadId}`,
    party: "chat",
    onMessage(e) {
      try {
        const parsed = JSON.parse(e.data);

        const result = ThreadEventSchema.safeParse(parsed);
        if (!result.success) {
          console.log("Invalid Thread Event");
          return;
        }

        const event = result.data
      } catch (error) {}
    },
  });
}
