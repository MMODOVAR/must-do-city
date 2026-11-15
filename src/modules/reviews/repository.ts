import type { Prisma } from "@prisma/client";
import { prisma } from "@/modules/shared/db";

export const reviewsRepository = {
  publishedFor: async (experienceId: string, opts: { rating?: number; orderBy: Prisma.ReviewOrderByWithRelationInput[]; take: number }) => {
    const where = { experienceId, published: true, ...(opts.rating ? { rating: opts.rating } : {}) };
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({ where, orderBy: opts.orderBy, take: opts.take }),
      prisma.review.count({ where }),
    ]);
    return { reviews, total };
  },
  publishedRatings: async (experienceId: string) =>
    (await prisma.review.findMany({ where: { experienceId, published: true }, select: { rating: true } })).map((r) => r.rating),
  latestPublished: (take: number) =>
    prisma.review.findMany({
      where: { published: true, rating: { gte: 4 }, experience: { published: true } },
      orderBy: { createdAt: "desc" },
      take,
      include: { experience: { select: { title: true, slug: true, city: { select: { name: true } } } } },
    }),
  list: (where: Prisma.ReviewWhereInput) =>
    prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { experience: { select: { title: true, id: true } }, booking: { select: { reference: true } } },
    }),
  byId: (id: string) => prisma.review.findUnique({ where: { id } }),
  create: (data: Prisma.ReviewUncheckedCreateInput) => prisma.review.create({ data }),
  setPublished: (id: string, published: boolean) => prisma.review.update({ where: { id }, data: { published } }),
  delete: (id: string) => prisma.review.delete({ where: { id } }),
  count: () => prisma.review.count(),
};
