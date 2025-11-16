// app/router/index.ts
import { createChannel, getChannel, listChannels } from "./channel";
import { inviteMember } from "./member";
import { createMessage, listMessages } from "./message";
import { createWorkspace, listWorkspace } from "./workspace";

export const router = {
  workspace: {
    list: listWorkspace,
    create: createWorkspace,
    member: {
      list: "",
      invite: inviteMember,
    },
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
