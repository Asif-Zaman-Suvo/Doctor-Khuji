import "dotenv/config";
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Also load .env.local for Next.js compatibility
config({ path: ".env.local", override: false });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
