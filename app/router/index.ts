import { createChannel, listChannels } from "./channel";
import { createMessage, listMessages } from "./message";
import { createWorkspace, listWorkspace } from "./workspace";

export const router = {
  workspace: {
    list: listWorkspace,
    create: createWorkspace,
  },

  channel: {
    create: createChannel,
    list: listChannels,
  },

  message: {
    create: createMessage,
    list: listMessages,
  },
};
