import z from "zod";
import { base } from "../middleware/base";
import { workspaceSchema } from "../schemas/workspace";
import { requiredAuthMiddleware } from "../middleware/auth";
import { ApiError, init, Organizations, Users } from "@kinde/management-api-js";
import { requiredWorkspaceMiddleware } from "../middleware/workspace";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { KindeOrganization, KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { heavyWriteSecurityMiddleware } from "../middleware/arcjet/heavy-write";
import { standardSecurityMiddleware } from "../middleware/arcjet/standard";

function getKindeErrorMessage(error: unknown): string {
  if (!error) return "Unknown Kinde error";

  const maybeError = error as {
    message?: string;
    body?: unknown;
  };

  const body = maybeError.body;
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    const message =
      (typeof record.message === "string" && record.message) ||
      (typeof record.error === "string" && record.error) ||
      (typeof record.error_description === "string" &&
        record.error_description);

    if (message) return message;
  }

  if (maybeError.message) return maybeError.message;
  return "Unknown Kinde error";
}

function ensureKindeManagementEnv() {
  const missing: string[] = [];

  if (!process.env.KINDE_MANAGEMENT_CLIENT_ID) {
    missing.push("KINDE_MANAGEMENT_CLIENT_ID");
  }
  if (!process.env.KINDE_MANAGEMENT_CLIENT_SECRET) {
    missing.push("KINDE_MANAGEMENT_CLIENT_SECRET");
  }
  if (!process.env.KINDE_DOMAIN) {
    missing.push("KINDE_DOMAIN");
  }

  if (missing.length > 0) {
    throw new Error(`Missing required Kinde env vars: ${missing.join(", ")}`);
  }
}

export const listWorkspace = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .route({
    method: "GET",
    path: "/workspace",
    summary: "list all workspaces",
    tags: ["workspace"],
  })
  .input(z.void())
  .output(
    z.object({
      workspaces: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          avatar: z.string(),
        })
      ),
      user: z.custom<KindeUser<Record<string, unknown>>>(),
      currentWorkspace: z.custom<KindeOrganization<unknown>>(),
    })
  )
  .handler(async ({ context, errors }) => {
    try {
      ensureKindeManagementEnv();
      init();

      const userData = await Users.getUserData({
        id: context.user.id,
        expand: "organizations",
      });

      const orgCodes = userData.organizations ?? [];
      const orgs = await Promise.all(
        orgCodes.map(async (code) => {
          try {
            const org = await Organizations.getOrganization({ code });
            return {
              id: org.code ?? code,
              name: org.name ?? "My Workspace",
              avatar: (org.name ?? "M").charAt(0),
            };
          } catch {
            return {
              id: code,
              name: "My Workspace",
              avatar: "M",
            };
          }
        })
      );

      return {
        workspaces: orgs,
        user: context.user,
        currentWorkspace: context.workspace,
      };
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        const reason = getKindeErrorMessage(error);

        if (error.status === 401 || error.status === 403) {
          throw errors.FORBIDDEN({
            message:
              `Kinde Management API denied workspace listing (${error.status}). ` +
              "Check M2M scopes (e.g. read:users, read:organizations). " +
              `Reason: ${reason}`,
          });
        }

        if (error.status === 429) {
          throw errors.RATE_LIMITED({
            message: `Kinde rate limit hit. Reason: ${reason}`,
          });
        }
      }

      throw errors.INTERNAL_SERVER_ERROR({
        message: `Failed to list workspaces: ${getKindeErrorMessage(error)}`,
      });
    }
  });

export const createWorkspace = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(heavyWriteSecurityMiddleware)
  .route({
    method: "POST",
    path: "/workspace",
    summary: "Create a new workspace",
    tags: ["workspace"],
  })
  .input(workspaceSchema)
  .output(
    z.object({
      orgCode: z.string(),
      workspaceName: z.string(),
    })
  )
  .handler(async ({ context, errors, input }) => {
    init();

    let data;

    try {
      data = await Organizations.createOrganization({
        requestBody: {
          name: input.name,
        },
      });
    } catch {
      throw errors.FORBIDDEN();
    }

    if (!data.organization?.code) {
      throw errors.FORBIDDEN({
        message: "Organization code not found",
      });
    }

    try {
      await Organizations.addOrganizationUsers({
        orgCode: data.organization.code,
        requestBody: {
          users: [
            {
              id: context.user.id,
              roles: ["admin"],
            },
          ],
        },
      });
    } catch {
      throw errors.FORBIDDEN();
    }

    const { refreshTokens } = getKindeServerSession();

    await refreshTokens();

    return {
      orgCode: data.organization.code,
      workspaceName: input.name,
    };
  });

export const debugSession = base
  .use(requiredAuthMiddleware)
  .route({
    method: "GET",
    path: "/workspace/debug",
    summary: "Debug Kinde session claims",
    tags: ["workspace"],
  })
  .input(z.void())
  .output(
    z.object({
      user: z
        .object({
          id: z.string(),
          email: z.string().nullable(),
        })
        .nullable(),
      organization: z
        .object({
          orgCode: z.string().nullable(),
          orgName: z.string().nullable(),
        })
        .nullable(),
      orgsCount: z.number(),
      orgs: z.array(
        z.object({
          code: z.string(),
          name: z.string().nullable(),
        })
      ),
    })
  )
  .handler(async ({ context }) => {
    const { getUserOrganizations, getOrganization } = getKindeServerSession();
    const organizations = await getUserOrganizations();
    const organization = await getOrganization();

    return {
      user: context.user
        ? { id: context.user.id, email: context.user.email ?? null }
        : null,
      organization: organization
        ? { orgCode: organization.orgCode ?? null, orgName: organization.orgName ?? null }
        : null,
      orgsCount: organizations?.orgs?.length ?? 0,
      orgs:
        organizations?.orgs?.map((org) => ({
          code: org.code,
          name: org.name ?? null,
        })) ?? [],
    };
  });
