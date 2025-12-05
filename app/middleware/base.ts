import { ArcjetNextRequest } from "@arcjet/next";
import { os } from "@orpc/server";

export const base = os
  .$context<{ request: Request | w }>()
  .errors({
    RATE_LIMITED: {
      message: "You are beign rate limited.",
    },
    BAD_REQUEST: {
      message: "Bad request",
    },
    NOT_FOUND: {
      message: "Not found",
    },
    FORBIDDEN: {
      message: "This is forbidden",
    },
    UNAUTHORIZED: {
      message: "You are Unauthorized",
    },
    INTERNAL_SERVER_ERROR: {
      message: "Internal Server Error",
    },
  });
