import type { NextConfig } from "next";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error — PrismaPlugin has no published TypeScript types
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
        protocol: "https",
      },
      {
        hostname: "*.googleusercontent.com",
        protocol: "https",
      },
      {
        hostname: "avatar.vercel.sh",
        protocol: "https",
      },
      {
        hostname: "2ae8l5wy71.ufs.sh",
        protocol: "https",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  },
};

export default nextConfig;
