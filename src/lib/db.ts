import { PrismaClient } from "@prisma/client";

/**
 * Prisma client (standard engine, prebuilt for Windows/macOS/Linux — no native
 * compilation needed). DATABASE_URL "file:./dev.db" is resolved relative to
 * prisma/schema.prisma, so the app and `prisma migrate` share the same file.
 *
 * Moving to Postgres: change the datasource provider in schema.prisma and set
 * DATABASE_URL to a postgresql:// URL.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
