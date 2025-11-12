import { createChannel, getChannel, listChannels } from "./channel";
import { createMessage, listMessages } from "./message";
import { createWorkspace, listWorkspace } from "./workspace";

export const router = {
  workspace: {
    list: listWorkspace,
    create: createWorkspace,
    member: {
      invite: ""
    }
  },

  channel: {
    create: createChannel,
    list: listChannels,
    get: getChannel,
  },

  message: {
    create: createMessage,
    list: listMessages,
  },
};
