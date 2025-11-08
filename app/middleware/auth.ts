import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { base } from "./base";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { redirect } from "next/navigation";

export const requiredAuthMiddleware = base
  .$context<{
    session?: { user?: KindeUser<Record<string, unknown>> };
  }>()
  .middleware(async ({ context, next }) => {
    const session = context.session ?? (await getSession());

    if (!session.user) {
      return redirect("/api/auth/login");
    }

    return next({
      context: { user: session.user },
    });
  });

const getSession = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return { user };
};
