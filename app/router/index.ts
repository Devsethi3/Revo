import { createChannel, getChannel, listChannels } from "./channel";
import { inviteMember, listMembers } from "./member";
import {
  createMessage,
  listMessages,
  listThreadReplies,
  updateMessage,
} from "./message";
import { createWorkspace, listWorkspace } from "./workspace";

export const router = {
  workspace: {
    list: listWorkspace,
    create: createWorkspace,
    member: {
      list: listMembers,
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
    update: updateMessage,
    thread: {
      list: listThreadReplies,
    },
  },
};
