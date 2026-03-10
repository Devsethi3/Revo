import z from "zod";
import { heavyWriteSecurityMiddleware } from "../middleware/arcjet/heavy-write";
import { standardSecurityMiddleware } from "../middleware/arcjet/standard";
import { requiredAuthMiddleware } from "../middleware/auth";
import { base } from "../middleware/base";
import { requiredWorkspaceMiddleware } from "../middleware/workspace";
import { inviteMemberSchema } from "../schemas/member";
import {
  ApiError,
  init,
  organization_user,
  Organizations,
  Users,
} from "@kinde/management-api-js";
import { getAvatar } from "@/lib/get-avatar";
import { readSecurityMiddleware } from "../middleware/arcjet/read";

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

export const inviteMember = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(heavyWriteSecurityMiddleware)
  .route({
    method: "POST",
    path: "/workspace/members/invite",
    summary: "Invite Member",
    tags: ["Members"],
  })
  .input(inviteMemberSchema)
  .output(z.void())
  .handler(async ({ input, context, errors }) => {
    try {
      ensureKindeManagementEnv();
      init();

      await Users.createUser({
        requestBody: {
          organization_code: context.workspace.orgCode,
          profile: {
            given_name: input.name,
            picture: getAvatar(null, input.email),
          },
          identities: [
            {
              type: "email",
              details: {
                email: input.email,
              },
            },
          ],
        },
      });
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        const reason = getKindeErrorMessage(error);

        if (error.status === 401 || error.status === 403) {
          throw errors.FORBIDDEN({
            message:
              `Kinde Management API denied this request (${error.status}). ` +
              "Check M2M scopes (e.g. create:users) and credentials. " +
              `Reason: ${reason}`,
          });
        }

        if (error.status === 409) {
          throw errors.BAD_REQUEST({
            message:
              "A user with this email already exists. Invite flow requires existing-user handling.",
          });
        }

        if (error.status === 429) {
          throw errors.RATE_LIMITED({
            message: `Kinde rate limit hit. Reason: ${reason}`,
          });
        }

        throw errors.INTERNAL_SERVER_ERROR({
          message: `Kinde invite failed (${error.status}): ${reason}`,
        });
      }

      const reason = getKindeErrorMessage(error);
      throw errors.INTERNAL_SERVER_ERROR({
        message: `Invite failed before Kinde call completed: ${reason}`,
      });
    }
  });

export const listMembers = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(readSecurityMiddleware)
  .route({
    method: "GET",
    path: "/workspace/members",
    summary: "List all members",
    tags: ["Members"],
  })
  .input(z.void())
  .output(z.array(z.custom<organization_user>()))
  .handler(async ({ context, errors }) => {
    try {
      ensureKindeManagementEnv();
      init();

      const data = await Organizations.getOrganizationUsers({
        orgCode: context.workspace.orgCode,
        sort: "name_asc",
      });

      if (!data.organization_users) {
        throw errors.NOT_FOUND();
      }

      return data.organization_users;
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        const reason = getKindeErrorMessage(error);

        if (error.status === 401 || error.status === 403) {
          throw errors.FORBIDDEN({
            message:
              `Kinde Management API denied member listing (${error.status}). ` +
              "Check M2M scopes (e.g. read:organization_users). " +
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
        message: `Failed to list members: ${getKindeErrorMessage(error)}`,
      });
    }
  });
