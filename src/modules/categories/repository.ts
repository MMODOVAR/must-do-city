import { prisma } from "@/modules/shared/db";
import type { CategoryInput } from "./schemas";

const order = [{ sortOrder: "asc" as const }, { name: "asc" as const }];

export const categoriesRepository = {
  withPublishedCounts: () =>
    prisma.category.findMany({
      orderBy: order,
      include: { _count: { select: { experiences: { where: { published: true } } } } },
    }),
  all: () => prisma.category.findMany({ orderBy: order, include: { _count: { select: { experiences: true } } } }),
  byId: (id: string) => prisma.category.findUnique({ where: { id } }),
  create: (data: CategoryInput & { slug: string }) => prisma.category.create({ data }),
  update: (id: string, data: CategoryInput & { slug: string }) => prisma.category.update({ where: { id }, data }),
  delete: (id: string) => prisma.category.delete({ where: { id } }),
};
