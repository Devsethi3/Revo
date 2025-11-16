import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { defineConfig, env } from "prisma/config";

console.log("🔍 DATABASE_URL from process.env:", process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not being loaded from .env file");
} else {
  console.log("✅ DATABASE_URL loaded successfully");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
