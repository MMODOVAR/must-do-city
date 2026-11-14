import { PrismaClient } from "@prisma/client";

/**
 * Single Prisma client for the whole app. Only repositories (`*.repository.ts`)
 * should import it — pages and components go through module services.
 *
 * DATABASE_URL "file:./dev.db" is resolved relative to prisma/schema.prisma.
 * Moving to Postgres: change the datasource provider in schema.prisma and set
 * DATABASE_URL to a postgresql:// URL.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
