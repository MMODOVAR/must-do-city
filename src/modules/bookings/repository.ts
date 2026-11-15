import type { Prisma } from "@prisma/client";
import { prisma } from "@/modules/shared/db";

const withExperience = { experience: { include: { city: true, host: true } } } satisfies Prisma.BookingInclude;

export const bookingsRepository = {
  create: (data: Prisma.BookingUncheckedCreateInput) => prisma.booking.create({ data }),
  referenceExists: async (reference: string) => !!(await prisma.booking.findUnique({ where: { reference }, select: { id: true } })),
  list: (status?: string) =>
    prisma.booking.findMany({ where: status ? { status } : undefined, orderBy: { createdAt: "desc" }, include: withExperience }),
  byId: (id: string) => prisma.booking.findUnique({ where: { id }, include: { ...withExperience, review: true } }),
  byReference: (reference: string) =>
    prisma.booking.findUnique({ where: { reference }, include: { review: { select: { id: true } } } }),
  updateStatus: (id: string, status: string, adminNote: string | null) =>
    prisma.booking.update({ where: { id }, data: { status, adminNote } }),
  countsByStatus: async () => {
    const rows = await prisma.booking.groupBy({ by: ["status"], _count: { _all: true } });
    return Object.fromEntries(rows.map((r) => [r.status, r._count._all])) as Record<string, number>;
  },
  recent: (take: number) => prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take, include: withExperience }),
};
