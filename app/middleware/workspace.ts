import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { base } from "./base";
import { KindeOrganization, KindeUser } from "@kinde-oss/kinde-auth-nextjs";

export const requiredWorkspaceMiddleware = base
  .$context<{
    workspace?: KindeOrganization<unknown | null>;
  }>()
  .middleware(async ({ context, next, errors }) => {
    const workspace = context.workspace ?? (await getWorkspace());

    if (!workspace) {
      throw errors.FORBIDDEN();
    }

    return next({
      context: { workspace },
    });
  });

const getWorkspace = async () => {
  const { getOrganization } = getKindeServerSession();

  const organization = await getOrganization();

  return organization;
};
