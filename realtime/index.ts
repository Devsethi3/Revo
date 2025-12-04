import {
  ChannelEventSchema,
  PresenceMessageSchema,
  ThreadEventSchema,
  UserSchema,
} from "@/app/schemas/realtime";
import { Connection, routePartykitRequest, Server } from "partyserver";
import z from "zod";

type Env = { Chat: DurableObjectNamespace<Chat> };

const ConnectionStateSchema = z
  .object({
    user: UserSchema.nullable().optional(),
  })
  .nullable();

type ConnectionState = z.infer<typeof ConnectionStateSchema>;

type Message = z.infer<typeof PresenceMessageSchema>;

// Define your Server
export class Chat extends Server {
  static options: {
    hibernate: true;
  };

  onConnect(connection: Connection) {
    console.log("Connected", connection.id, "to server", this.name);

    // Send current presence to the newly connected user
    connection.send(JSON.stringify(this.getPresenceMessage()));
  }

  onClose(connection: Connection) {
    console.log(`User disconnected: ${connection.id}`);

    this.updateUsers();
  }

  onError(connection: Connection) {
    console.log(`Connection Error: ${connection.id}`);

    this.updateUsers();
  }

  onMessage(connection: Connection, message: string) {
    try {
      const parsed = JSON.parse(message);
      const presence = PresenceMessageSchema.safeParse(parsed);

      if (presence.success) {
        if (presence.data.type === "add-user") {
          // store user info on the connection
          this.setConnectionState(connection, { user: presence.data.payload });

          // Broadcast updated presence to all the clients

          this.updateUsers();

          return;
        }
      }
      if (presence.data?.type === "remove-user") {
        this.setConnectionState(connection, null);

        this.updateUsers();

        return;
      }

      // Channel Events
      const channelEvent = ChannelEventSchema.safeParse(parsed);

      if (channelEvent.success) {
        const payload = JSON.stringify(channelEvent.data);

        this.broadcast(payload, [connection.id]);
        return;
      }

      // Thread Events
      const threadEvent = ThreadEventSchema.safeParse(parsed);

      if (threadEvent.success) {
        const payload = JSON.stringify(threadEvent.data);

        this.broadcast(payload, [connection.id]);
        return;
      }
    } catch (error) {
      console.log("Error processing message", error);
    }
  }

  updateUsers() {
    const presenceMessage = JSON.stringify(this.getPresenceMessage());

    // Use partyservers build in broadcast
    this.broadcast(presenceMessage);
  }

  getPresenceMessage() {
    return {
      type: "presence",
      payload: { users: this.getUsers() },
    } satisfies Message;
  }

  getUsers() {
    const users = new Map();

    for (const connection of this.getConnections()) {
      const state = this.getConnectionState(connection);

      if (state?.user) {
        users.set(state.user.id, state.user);
      }
    }

    return Array.from(users.values());
  }

  private setConnectionState(connection: Connection, state: ConnectionState) {
    connection.setState(state);
  }

  private getConnectionState(connection: Connection): ConnectionState {
    const result = ConnectionStateSchema.safeParse(connection.state);

    if (result.success) {
      return result.data;
    }

    return null;
  }
}

export default {
  // Set up your fetch handler to use configured Servers
  async fetch(request: Request, env: Env): Promise<Response> {
    return (
      (await routePartykitRequest(request, env)) ||
      new Response("Not Found", { status: 404 })
    );
  },
} satisfies ExportedHandler<Env>;
