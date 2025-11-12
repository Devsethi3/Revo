import { heavyWriteSecurityMiddleware } from "../middleware/arcjet/heavy-write";
import { standardSecurityMiddleware } from "../middleware/arcjet/standard";
import { requiredAuthMiddleware } from "../middleware/auth";
import { base } from "../middleware/base";
import { requiredWorkspaceMiddleware } from "../middleware/workspace";
import { inviteMemberSchema } from "../schemas/member";

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
  .output(z.void());
