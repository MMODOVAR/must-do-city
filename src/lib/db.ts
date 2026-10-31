import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";

/**
 * Prisma uses the Rust-free client with a driver adapter.
 * DATABASE_URL "file:./dev.db" is resolved relative to /prisma, the same way
 * the Prisma CLI resolves it, so the app and `prisma migrate` share one file.
 *
 * Moving to Postgres: change the datasource provider in schema.prisma,
 * install @prisma/adapter-pg and swap the adapter below for PrismaPg.
 */
function createClient() {
  const url = process.env.DATABASE_URL ?? "file:./dev.db";
  const file = url.replace(/^file:/, "");
  const resolved = path.isAbsolute(file) ? file : path.join(process.cwd(), "prisma", file);
  return new PrismaClient({ adapter: new PrismaBetterSQLite3({ url: `file:${resolved}` }) });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
