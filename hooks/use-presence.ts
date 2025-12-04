import { useState } from "react";
import usePartySocket from "partysocket/react";
import {
  PresenceMessageSchema,
  PresenceMessageSchemaType,
  User,
} from "@/app/schemas/realtime";

interface usePresenceProps {
  room: string;
  currentUser: User | null;
}

export function usePresence({ room, currentUser }: usePresenceProps) {
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

  const socket = usePartySocket({
    host: "http://127.0.0.1:8787",
    room: room,
    party: "chat",
    onOpen() {
      console.log("Connected to presence room:", room);

      if (currentUser) {
        const message: PresenceMessageSchemaType = {
          type: "add-user",
          payload: currentUser,
        };

        socket.send(JSON.stringify(message));
      }
    },
    onMessage(event) {
      try {
        const message = JSON.parse(event.data);
        const result = PresenceMessageSchema.safeParse(message);

        if (result.success && result.data.type === "presence") {
          setOnlineUsers(result.data.payload.users);
        }
      } catch (error) {
        console.log("Failed to parse message", error);
      }
    },
    onClose() {
      console.log("Disconnected from presence room", room);
    },
    onError(error) {
      console.error("Websocket Error", error);
    },
  });

  return {
    onlineUsers,
    socket,
  };
}
