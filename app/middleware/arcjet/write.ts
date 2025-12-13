import arcjet, { sensitiveInfo, slidingWindow } from "@/lib/arcjet";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { base } from "../base";
import { ArcjetNextRequest } from "@arcjet/next";

const buildStandardAj = () =>
  arcjet
    .withRule(
      slidingWindow({
        mode: "LIVE",
        interval: "1m",
        max: 40,
      })
    )
    .withRule(
      sensitiveInfo({
        mode: "LIVE",
        deny: ["PHONE_NUMBER", "CREDIT_CARD_NUMBER"],
      })
    );

export const writeSecurityMiddleware = base
  .$context<{
    request: Request | ArcjetNextRequest;
    user: KindeUser<Record<string, unknown>>;
  }>()
  .middleware(async ({ context, next, errors }) => {
    const decision = await buildStandardAj().protect(context.request, {
      userId: context.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        throw errors.RATE_LIMITED({
          message: "Too many impactual changes. Please slow down",
        });
      }

      if (decision.reason.isRateLimit()) {
        throw errors.BAD_REQUEST({
          message:
            "Sensitive Information Detected! Please Remove PII (e.g., credit cards, phone numbers).",
        });
      }

      throw errors.FORBIDDEN({ message: "Request blocked!" });
    }

    return next();
  });
