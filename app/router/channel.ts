import z from "zod";
import { heavyWriteSecurityMiddleware } from "../middleware/arcjet/heavy-write";
import { standardSecurityMiddleware } from "../middleware/arcjet/standard";
import { requiredAuthMiddleware } from "../middleware/auth";
import { base } from "../middleware/base";
import { requiredWorkspaceMiddleware } from "../middleware/workspace";
import { ChannelNameSchema } from "../schemas/channel";
import prisma from "@/lib/db";
import { Channel } from "@/lib/generated/prisma";
import {
  init,
  organization_user,
  Organizations,
} from "@kinde/management-api-js";
import { KindeOrganization } from "@kinde-oss/kinde-auth-nextjs";
import { readSecurityMiddleware } from "../middleware/arcjet/read";

export const createChannel = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(heavyWriteSecurityMiddleware)
  .route({
    method: "POST",
    path: "/channels",
    summary: "Create a new channel",
    tags: ["channels"],
  })
  .input(ChannelNameSchema)
  .output(z.custom<Channel>())
  .handler(async ({ input, context }) => {
    const channel = await prisma.channel.create({
      data: {
        name: input.name,
        workspaceId: context.workspace.orgCode,
        createdById: context.user.id,
      },
    });

    return channel;
  });

export const listChannels = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .route({
    method: "GET",
    path: "/channels",
    summary: "List all channels",
    tags: ["channels"],
  })
  .input(z.void())
  .output(
    z.object({
      channels: z.array(z.custom<Channel>()),
      currentWorkspace: z.custom<KindeOrganization<unknown>>(),
      members: z.array(z.custom<organization_user>()),
    })
  )
  .handler(async ({ context }) => {
    const [channels, members] = await Promise.all([
      prisma.channel.findMany({
        where: {
          workspaceId: context.workspace.orgCode,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      (async () => {
        init();
        const usersInOrg = await Organizations.getOrganizationUsers({
          orgCode: context.workspace.orgCode,
          sort: "name_desc",
        });

        return usersInOrg.organization_users ?? [];
      })(),
    ]);

    return {
      channels,
      members,
      currentWorkspace: context.workspace,
    };
  });

export const getChannel = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(readSecurityMiddleware)
  .route({
    method: "GET",
    path: "/channels/:channelId",
    summary: "Get a channel by ID",
    tags: ["channels"],
  })
  .input(z.object({channelId: z.string()}))
  .output(z.void())
  .handler(async ({context,input,errors}) => {

  })
